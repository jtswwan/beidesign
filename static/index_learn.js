let userId = ""
const name = ""
let lineName = ""
const liff = window.liff // Declare the liff variable

//liff
window.onload = async () => {
  await liff.init({ liffId: "2007667595-X0Gx0BwM" })
  if (!liff.isLoggedIn()) {
    liff.login()
  } else {
    const profile = await liff.getProfile()
    userId = profile.userId
    lineName = profile.displayName
  }

  // 初始化進度指示器
  initProgressIndicator()
  // 初始化介面增強功能
  initInterfaceEnhancements()
}

let currentSlide = 0
const slides = document.querySelectorAll(".slide")

// 初始化進度指示器
function initProgressIndicator() {
  const progressContainer = document.createElement("div")
  progressContainer.className = "progress-container"

  const progressSteps = document.createElement("div")
  progressSteps.className = "progress-steps"

  for (let i = 0; i < slides.length; i++) {
    const step = document.createElement("div")
    step.className = "progress-step"
    if (i === 0) step.classList.add("active")
    progressSteps.appendChild(step)

    if (i < slides.length - 1) {
      const line = document.createElement("div")
      line.className = "progress-line"
      progressSteps.appendChild(line)
    }
  }

  progressContainer.appendChild(progressSteps)
  document.body.appendChild(progressContainer)
}

// 更新進度指示器
function updateProgressIndicator() {
  const steps = document.querySelectorAll(".progress-step")
  const lines = document.querySelectorAll(".progress-line")

  steps.forEach((step, index) => {
    step.classList.remove("active", "completed")
    if (index < currentSlide) {
      step.classList.add("completed")
    } else if (index === currentSlide) {
      step.classList.add("active")
    }
  })

  lines.forEach((line, index) => {
    line.classList.remove("active")
    if (index < currentSlide) {
      line.classList.add("active")
    }
  })
}

function showSlide(index) {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add("active")
    } else {
      slide.classList.remove("active")
    }
  })
  currentSlide = index
  updateProgressIndicator()
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    showSlide(currentSlide + 1)
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1)
  }
}

function toggleOtherUsage() {
  const usage = document.getElementById("usage").value
  const otherInput = document.getElementById("otherUsage")
  if (usage === "其他") {
    otherInput.style.display = "block"
    otherInput.style.animation = "slideIn 0.3s ease-out"
  } else {
    otherInput.style.display = "none"
  }
}

// 增強的圖片過濾功能
function filterImages(category) {
  const images = document.querySelectorAll(".image")
  const buttons = document.querySelectorAll(".filter-buttons button")

  // 更新按鈕狀態
  buttons.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.textContent === category || (category === "all" && btn.textContent === "全部")) {
      btn.classList.add("active")
    }
  })

  // 過濾圖片
  images.forEach((img) => {
    if (category === "all" || img.classList.contains(category)) {
      img.style.display = "inline-block"
      img.style.animation = "slideIn 0.3s ease-out"
    } else {
      img.style.display = "none"
    }
  })
}

function selectImage(img) {
  if (img.classList.contains("selected")) {
    img.classList.remove("selected")
  } else {
    img.classList.add("selected")
  }

  // 更新選中計數
  updateSelectedCount()
}

// 更新選中圖片計數
function updateSelectedCount() {
  const selectedImages = document.querySelectorAll(".image.selected")
  const countElement = document.getElementById("selectedCount")
  if (countElement) {
    countElement.textContent = `已選擇 ${selectedImages.length} 張圖片`
  }
}

// 增強的表單提交
async function submitForm() {
  const submitButton = event.target
  const originalText = submitButton.textContent

  // 顯示載入狀態
  submitButton.innerHTML = '<span class="loading"></span> 提交中...'
  submitButton.disabled = true

  try {
    const usage = document.getElementById("usage").value
    const other = document.getElementById("otherUsage").value
    const brand = document.getElementById("brand").value
    const desc = document.getElementById("description").value
    const elements = document.getElementById("elements").value
    let realUsage = ""
    if (usage === "其他") {
      realUsage = other
    } else {
      realUsage = usage
    }

    const selectedImages = document.querySelectorAll(".image.selected")
    const paths = Array.from(selectedImages).map((img) => {
      const parts = img.src.split("/")
      const folder = parts[parts.length - 2]
      const file = parts[parts.length - 1]
      return `${folder}/${file}`
    })

    const result = {
      userId: userId,
      line_name: lineName,
      usage: realUsage,
      brand: brand,
      description: desc,
      elements: elements,
      likedImages: paths,
    }

    const res = await fetch("/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    })

    const json = await res.json()
    if (json.status === "success") {
      showSuccessMessage("問卷提交成功！")

      //user發送訊息
      await liff.sendMessages([
        {
          type: "text",
          text: "我已完成問卷",
        },
      ])

      //結束 LIFF
      setTimeout(() => {
        liff.closeWindow()
      }, 2000)
    } else {
      throw new Error(json.message || "提交失敗")
    }
  } catch (err) {
    showErrorMessage("提交失敗：" + err.message)
    submitButton.textContent = originalText
    submitButton.disabled = false
  }
}

// 顯示成功訊息
function showSuccessMessage(message) {
  const successDiv = document.createElement("div")
  successDiv.className = "success-message"
  successDiv.textContent = message
  document.body.appendChild(successDiv)

  setTimeout(() => {
    successDiv.remove()
  }, 3000)
}

// 顯示錯誤訊息
function showErrorMessage(message) {
  alert(message) // 可以替換為更美觀的錯誤提示
}

// 初始化介面增強功能
function initInterfaceEnhancements() {
  // 為所有輸入框添加焦點效果
  const inputs = document.querySelectorAll("input, textarea, select")
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused")
    })

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused")
    })
  })

  // 添加選中圖片計數顯示
  const imageContainer = document.querySelector(".image-container")
  if (imageContainer) {
    const countDiv = document.createElement("div")
    countDiv.id = "selectedCount"
    countDiv.textContent = "已選擇 0 張圖片"
    imageContainer.parentNode.insertBefore(countDiv, imageContainer.nextSibling)
  }

  // 初始化過濾按鈕狀態
  const firstFilterButton = document.querySelector(".filter-buttons button")
  if (firstFilterButton) {
    firstFilterButton.classList.add("active")
  }
}

// 鍵盤導航支援
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "Enter") {
    if (currentSlide < slides.length - 1) {
      nextSlide()
    }
  } else if (e.key === "ArrowLeft") {
    if (currentSlide > 0) {
      prevSlide()
    }
  }
})
