class MessageBox {
    BOX_CONTENT =
    `
    <div class="message-edge"></div>
    <div class="message-body"></div>
    <div class="message-close">
        <div>close</div>
    </div>
    `

    constructor() {
        this.boxs = Array();
        this.createBox();
    }

    createBox(type) {
        let box = document.createElement("div");
        box.classList.add("message");
        box.id = "messageBox" + String(this.boxs.length + 1);
        box.innerHTML = this.BOX_CONTENT;
        if (this.boxs.length > 0) {
            box.style.bottom = String(this.boxs.length * 70 + 10) + "px";
        }
        document.getElementById("content-container").appendChild(box);
        this.boxs.push(box);
        box.querySelector(".message-close").addEventListener('click', (event) => {
            box.style.right = "-401px";
        });
    }

    showSuccess(message, boxIndex = 0) {
        if (boxIndex >= this.boxs.length) {
            console.log("invalid index for messageBox!");
            return;
        }
        this.boxs[boxIndex].classList.add("success");
        this.boxs[boxIndex].querySelector(".message-body").innerText = message;
        this.boxs[boxIndex].style.right = "0px";
    }

    showFailure(message, boxIndex = 0) {
        if (boxIndex >= this.boxs.length) {
            console.log("invalid index for messageBox!");
            return;
        }
        this.boxs[boxIndex].classList.add("failure");
        this.boxs[boxIndex].querySelector(".message-body").innerText = message;
        this.boxs[boxIndex].style.right = "0px";
    }
}
