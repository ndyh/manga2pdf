import json
import requests
from bs4 import BeautifulSoup

def parser(url):
    return BeautifulSoul(requests.get(url).content, 'html.parser')
    
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
                'chapters': {}
            }

def lambda_handler(event, context):
    print(event)
    if event['rawPath'] == '/search':
        keyword = event['queryStringParameters']['q']
        # get list of series here
        parser(f'https://manganato.com/search/story/{keyword}')
        
