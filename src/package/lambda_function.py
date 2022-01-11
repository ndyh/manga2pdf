import json
import requests
from bs4 import BeautifulSoup

def parser(url):
    return BeautifulSoup(requests.get(url).content, 'html.parser')
    
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

def lambda_handler(event, context):
    story_list, story_info = ''
    print(event)
    if event['rawPath'] == '/s':
        keyword = event['queryStringParameters']['q']
        # get list of series here
        story_list = pull_story_list(parser(f'https://manganato.com/search/story/{keyword}'))
        return story_list
    elif event['rawPath'] == '/f':
        story_info = pull_story_info(parser(event['queryStringParameters']['s']))
        return story_info
    elif event['rawPath'] == '/c':
        # chap selection = event['queryStringParameters']['cs']
        # need both story selection and chapter total val/all chapters
        return 0
