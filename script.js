const API_KEY="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"

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

        const res = await fetch("https://corsproxy.io/?https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
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

        const text = await res.text()

        // DEBUG (important)
        console.log("RAW RESPONSE:", text)

        let data
        try {
            data = JSON.parse(text)
        } catch {
            throw new Error("Invalid JSON (proxy issue)")
        }

        chat.lastChild.remove()

        if(!data.choices){
            throw new Error("API blocked / invalid key / proxy failed")
        }

        addMessage(data.choices[0].message.content,"ai")

    }catch(e){
        chat.lastChild.remove()
        console.error(e)
        addMessage("❌ Error: API blocked or CORS issue","ai")
    }
}

sendBtn.onclick=sendMessage

input.addEventListener("keypress",e=>{
    if(e.key==="Enter") sendMessage()
})
