let userId = "";
let name = "";

//liff
window.onload = async function () {
  await liff.init({ liffId: "2007667595-X0Gx0BwM" });
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    userId = profile.userId;
    lineName = profile.displayName;
  }
}



let currentSlide = 0;
const slides = document.querySelectorAll('.slide');


function showSlide(index) {
    slides.forEach(function(slide, i){
        if (i === index){
            slide.classList.add("active");
        }else{
            slide.classList.remove("active");
        }
    });
    currentSlide = index;
}

function nextSlide() {
    if (currentSlide < slides.length - 1){
        showSlide(currentSlide + 1)
    };
}

function prevSlide() {
    if (currentSlide > 0){
        showSlide(currentSlide - 1)
    };
}

function toggleOtherUsage() {
    const usage = document.getElementById("usage").value;
    const otherInput = document.getElementById("otherUsage");
    if (usage === "其他") {
    otherInput.style.display = "block";
    } else {
    otherInput.style.display = "none";
    }
}

async function submitForm() {
    const usage = document.getElementById("usage").value;
    const other = document.getElementById("otherUsage").value;
    const brand = document.getElementById("brand").value;
    const desc = document.getElementById("description").value;
    const elements = document.getElementById("elements").value;
    let realUsage = ""
    if (usage === "其他"){
        realUsage = other;
    } else{
        realUsage = usage;
    }

    const selectedImages = document.querySelectorAll(".image.selected");
    const paths = Array.from(selectedImages).map(img => {
      const parts = img.src.split('/');           // 變成 ["https:", "", "example.com", "static", "圖片", "科技風", "3.jpg"]
      const folder = parts[parts.length - 2];     // "科技風"
      const file = parts[parts.length - 1];       // "3.jpg"
      return `${folder}/${file}`;                 // 合成 "科技風/3.jpg"
    });

    alert(
    `使用場景：${realUsage}\n` +
    `品牌名稱：${brand}\n` +
    `簡介：${desc}\n` +
    `加入元素：${elements}`
    );

    const result = {
      "userId": userId,
      "line_name":lineName,
      "usage": realUsage,
      "brand": brand,
      "description": desc,
      "elements": elements,
      "likedImages": paths
    };

  try {
    const res = await fetch("/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });

    const json = await res.json();
    if (json.status === "success") {
      alert("成功送出！");
    } else {
      alert("送出失敗：" + json.message);
    }
  } catch (err) {
    alert("錯誤：" + err.message);
  }

      //user發送訊息
      await liff.sendMessages([{
        type: "text",
        text: "我已完成問卷"
      }]);

      //結束 LIFF
      liff.closeWindow();
}

function filterImages(category) {
    const images = document.querySelectorAll('.image');
    images.forEach(img => {
    if (category === 'all' || img.classList.contains(category)) {
        img.style.display = 'inline-block';
    } else {
        img.style.display = 'none';
    }
    });
}

function selectImage(img) {
  if (img.classList.contains('selected')) {
    img.classList.remove('selected');
  } else {
    img.classList.add('selected');
  }
}
