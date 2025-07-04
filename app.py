from flask import Flask, render_template, url_for
import os
from flask import request, jsonify
import requests

base_path = "static/圖片"
# base_path = "幸福more/test/static/圖片"

app = Flask(__name__, static_folder='static')


@app.route("/")
def index():
    categories = {}
    
    for category in os.listdir(base_path):
        print(os.listdir(base_path))
        #category = 每個類別
        category_path = base_path+"/"+category
        if not os.path.isdir(category_path):
            #還有os.path.isfile()和os.path.exists()
            continue
        #category_path = 每個類別的路徑
        images = []
        #images = 每張照片的路徑(最後傳到字典categories)

        for img in os.listdir(category_path):
            img_path = url_for('static', filename=f"圖片/{category}/{img}")
            images.append(img_path)
        categories[category] = images
    return render_template("index.html", categories=categories)



if __name__ == "__main__":
    app.run(debug=True)
