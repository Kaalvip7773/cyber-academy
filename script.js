const MODEL="llama-3.3-70b-versatile"

const SYSTEM_PROMPT="You are WARM AI Designed By @KAALCRACKERYT, a world-class cybersecurity and coding expert. Provide highly detailed functional code."

const chat=document.getElementById("chat")
const input=document.getElementById("prompt")
const sendBtn=document.getElementById("sendBtn")

function addMessage(text,type){
    const div=document.createElement("div")
    div.className="message "+type

    if(text.includes("```")){
        div.innerHTML=formatCode(text)
    }else{
        div.textContent=text
    }

    chat.appendChild(div)
    chat.scrollTop=chat.scrollHeight
}

function formatCode(text){
    const parts=text.split("```")
    let html=""

    for(let i=0;i<parts.length;i++){
        if(i%2==0){
            html+="<p>"+parts[i]+"</p>"
        }else{
            html+=`
            <button class="copy" onclick="copyCode(this)">Copy</button>
            <pre><code>${parts[i]}</code></pre>
            `
        }
    }
    return html
}

function copyCode(btn){
    const code=btn.nextElementSibling.innerText
    navigator.clipboard.writeText(code)
    btn.innerText="Copied"
    setTimeout(()=>btn.innerText="Copy",1500)
}

async function sendMessage(){
    const prompt=input.value.trim()
    if(!prompt) return

    addMessage(prompt,"user")
    input.value=""
    addMessage("Thinking...","ai")

    try{
        const res = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: prompt }
                ]
            })
        })

        const data = await res.json()

        chat.lastChild.remove()

        if(!data.choices){
            throw new Error("API error")
        }

        addMessage(data.choices[0].message.content,"ai")

    }catch(e){
        chat.lastChild.remove()
        addMessage("❌ Server not running or API error","ai")
    }
}

sendBtn.onclick=sendMessage

input.addEventListener("keypress",e=>{
    if(e.key==="Enter") sendMessage()
})
