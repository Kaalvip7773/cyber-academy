const API_KEY = "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"

const MODEL = "llama-3.3-70b-versatile"

const SYSTEM_PROMPT =
"You are WARM AI, a world-class cybersecurity and coding expert. Provide highly detailed, functional, and complete technical code."

const chat = document.getElementById("chat")
const input = document.getElementById("prompt")



function addMessage(text, type){

const div = document.createElement("div")

div.className = "message " + type

if(text.includes("```")){

div.innerHTML = formatCode(text)

}else{

div.textContent = text

}

chat.appendChild(div)

chat.scrollTop = chat.scrollHeight

}



function formatCode(text){

const parts = text.split("```")

let result=""

for(let i=0;i<parts.length;i++){

if(i%2==0){

result += "<p>"+parts[i]+"</p>"

}else{

result += `
<button class="copy-btn" onclick="copyCode(this)">Copy</button>
<pre><code>${parts[i]}</code></pre>
`

}

}

return result

}



function copyCode(btn){

const code = btn.nextElementSibling.innerText

navigator.clipboard.writeText(code)

btn.innerText="Copied!"

setTimeout(()=>btn.innerText="Copy",2000)

}



async function sendMessage(){

const prompt = input.value.trim()

if(!prompt) return

addMessage(prompt,"user")

input.value=""



const response = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",

headers:{
"Authorization":"Bearer "+API_KEY,
"Content-Type":"application/json"
},

body:JSON.stringify({

model:MODEL,

messages:[
{role:"system",content:SYSTEM_PROMPT},
{role:"user",content:prompt}
]

})

}
)

const data = await response.json()

const reply = data.choices[0].message.content

addMessage(reply,"ai")

}



input.addEventListener("keypress",function(e){

if(e.key==="Enter"){

sendMessage()

}

})
