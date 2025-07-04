from flask import Flask, render_template, url_for
import os
from flask import request, jsonify
import requests
from flask_cors import CORS




app = Flask(__name__, static_folder='static')
CORS(app)
base_path = os.path.join(app.static_folder, "圖片")

@app.route("/")
def index():
    categories = {}
    
    for category in os.listdir(base_path):
        print(os.listdir(base_path))
        #category = 每個類別
        category_path = os.path.join(base_path, category)
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

@app.route('/submit-form', methods=['POST'])
def submit_form():
    data = request.json
    GAS_URL = "https://script.google.com/macros/s/AKfycbx3taqFrlcjTd1JYFVy5A5s8puSPvp8yGttLoF36cYHmsLgJK7Qnmln1OFUgB3A-0UoNw/exec"
    
    try:
        res = requests.post(GAS_URL, json=data)
        return jsonify({"status": "success", "gas_result": res.text})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})





@app.route('/debug-gas', methods=['GET'])
def debug_gas():
    test_data = {
        "userId": "debug_id",
        "line_name": "debug_user",
        "usage": "測試場景",
        "brand": "測試品牌",
        "description": "這是測試用描述",
        "elements": "測試元素",
        "likedImages": ["科技風/1.jpg", "可愛風/2.jpg"]
    }
    GAS_URL = "https://script.google.com/macros/s/AKfycbyMTQkS_YmuFBQkA1Q_jKW25w87XmciYeTV2XdnB2gtVpBSjKaWmaKIhVFYgptJaaAjxQ/exec"
    try:
        res = requests.post(GAS_URL, json=test_data)
        return jsonify({"status": "sent", "response": res.text})
    except Exception as e:
        return jsonify({"status": "fail", "message": str(e)})









if __name__ == "__main__":
    app.run(debug=True)
