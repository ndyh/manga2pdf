import json
import requests
from bs4 import BeautifulSoup

# To add to libraries folder and package for lambda copying
import os
import re
import base64
from PIL import Image
from fpdf import FPDF

HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'referer': 'https://readmanganato.com'
}

# list - list to alphanumerically sort and return

def alphanum_sort(list):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [convert(c) for c in re.split('([0-9]+)', key)]
    return sorted(list, key=alphanum_key)

# url - url to parse through beautifulsoup

def parser(url):
    return BeautifulSoup(requests.get(url).content, 'html.parser')

# html - parsed html including user query to pull list of relevant manga
    
def pull_story_list(html):
    story_list = {}
    container = html.find('div', {'class': 'panel-search-story'})
    for item in container.find_all('div', {'class': 'search-story-item'}):
        for data in item.find_all('a', {'class': 'item-img'}):
            title, img_src = '', ''
            link = data['href']
            for img in data.find_all('img'):
                title = img['alt']
                img_src = img['src']
            story_list[link] = {
                'title': title,
                'thumbnail': img_src,
                'chapters': []
            }
    return story_list

# html - parsed html to pull manga info from (description, total chapters)
    
def pull_story_info(html):
    counter = 0
    desc = html.find('div', {'id': 'panel-story-info-description'}).text
    chapter_container = html.find('ul', {'class': 'row-content-chapter'})
    for chapter in chapter_container.find_all('li', {'class': 'a-h'}):
        counter = counter + 1
    info = {
        'desc': desc,
        'chapters': counter
    }
    return info

# html - parsed html from manga series chapter to pull images from
# sid - series id (example -> manga-xy345678)
# chapter - counter value

def pull_chapter_image(html, sid, chapter):
    chapter_image_container = html.find('div', {'class': 'container-chapter-reader'})
    for idx, img in enumerate(chapter_image_container.find_all('img')):
        src = img.get('src')
        img_filepath = f'./tmp-{sid}/{str(chapter)}/{str(idx+1)}.jpg'
        with open(img_filepath, 'wb') as file:
            session = requests.Session()
            response = session.get(src, headers = HEADERS)
            if not response.ok:
                return response
            for block in response.iter_content(1024):
                if not block:
                    break
                file.write(block)

# pdf - pdf to add images to
# pdf_sizes - predefined sizes of pdf based on orientation
# chapter_dir - directory to pull images from
# img - image to add to pdf

def add_page_to_pdf(pdf, pdf_sizes, chapter_dir, img):
    i = Image.open(f'{chapter_dir}/{img}')
    w, h = i.size
    w, h = float(w * 0.264583), float(h * 0.264583)
    orientation = 'Portrait' if w < h else 'Landscape'
    w = w if w < pdf_sizes[orientation]['w'] else pdf_sizes[orientation]['w']
    h = h if h < pdf_sizes[orientation]['h'] else pdf_sizes[orientation]['h']
    pdf.add_page(orientation=orientation)
    try:
        pdf.image(f'{chapter_dir}/{img}', 0, 0, w, h)
    except:
        try:
            i.save(f'{chapter_dir}/{img[:img.find(".jpg")]}.png')
            pdf.image(f'{chapter_dir}/{img[:img.find(".jpg")]}.png', 0, 0, w, h)
        except:
            return 'Failure to convert'
            
def lambda_handler(event, context):
    story = ''
    print(event)
    if event['rawPath'] == '/s':
        keyword = event['queryStringParameters']['q']
        # get list of series here
        story_info = pull_story_list(parser(f'https://manganato.com/search/story/{keyword}'))
        return story_info
    elif event['rawPath'] == '/f':
        story = pull_story_info(parser(event['queryStringParameters']['s']))
        return story
    elif event['rawPath'] == '/c':
        # loop through range of chapter min to chapter max
        # download each image within manga image container
        # convert each image within each chapter container to pdf (chapter of pdf?)
        # host pdf in some manner to an accessable link, return link to user in new tab

        series_link = event['queryStringParameters']['s']
        series_id = series_link[len(series_link) - 8:]
        chapter_min = event['queryStringParameters']['f']
        chapter_max = event['queryStringParameters']['l']
        pdf = FPDF()
        pdf_sizes = {
            'Portrait': {'w': 210, 'h': 297},
            'Landscape': {'w': 297, 'h': 210}
        }
        file_name = f'{series_id}_{chapter_min}-{chapter_max}.pdf'
        file_to_serve = ''

        print(file_name)

        for chapter in range(chapter_min, (chapter_max + 1)):
            chapter_dir = f'tmp-{series_id}/{str(chapter)}/'
            print(chapter_dir)
            os.mkdir(chapter_dir)
            pull_chapter_image(
                parser(f'{series_link}/chapter-{str(chapter)}'),
                series_id, chapter
            )
            for img in alphanum_sort(os.listdir(chapter_dir)):
                add_page_to_pdf(pdf, pdf_sizes, chapter_dir, img)

        pdf.output(file_name, 'F')
        with open(file_name, 'rb') as pdf_file:
            file_to_serve = base64.b64encode(pdf_file.read())
        
        return {
            'isBase64Encoded': True,
            'statusCode': 200,
            'headers': {
                'content-type': 'application/pdf'
            },
            'body': file_to_serve
        }
