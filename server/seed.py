from app import app
from models import db, News
import json
from datetime import datetime


def load_data_from_json():
    news_entries = []

    with open('db.json', 'r') as json_file:
        data = json.load(json_file)['data']
    
    if not isinstance(data, list):
        print("JSON data is not a list of entries.")
        return news_entries

    for entry in data:
        if not isinstance(entry, dict):
            print("Entry is not a dictionary, skipping:", entry)
            continue

        news_entry = News(
            title=entry.get('title'),
            date_published=datetime.strptime(entry.get('date_published'), '%Y-%m-%dT%H:%M:%S%z'),
            author=entry.get('author'),
            content=entry.get('content'),
            article_image=entry.get('article_image'),
            publishing_organization=entry.get('publishing_organization'),
        )
        db.session.add(news_entry)
        news_entries.append(news_entry)

    db.session.commit()
    return news_entries



if __name__ == '__main__':
    
    with app.app_context():
        print("Starting seed...")
        News.query.delete()
        print('Seeding news...')
        news = load_data_from_json()
        db.session.add_all(news)
        db.session.commit()

        print("done")
      
