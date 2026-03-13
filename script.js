const API_KEY = "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"

const MODEL = "llama-3.3-70b-versatile"

const SYSTEM_PROMPT =
"You are WARM AI, a world-class cybersecurity and coding expert. Provide highly detailed, functional, and complete technical code."


async function askAI(){

const prompt = document.getElementById("prompt").value

const chat = document.getElementById("chat")

chat.innerHTML += "<p>> " + prompt + "</p>"

document.getElementById("prompt").value = ""

const response = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",

headers:{
"Authorization":"Bearer " + API_KEY,
"Content-Type":"application/json"
},

body:JSON.stringify({

model:MODEL,

messages:[
{role:"system",content:SYSTEM_PROMPT},
{role:"user",content:prompt}
],

temperature:0.7

})

}
)

const data = await response.json()

const reply = data.choices[0].message.content

chat.innerHTML += "<p style='color:#0ff'>" + reply + "</p>"

chat.scrollTop = chat.scrollHeight

}













/* MATRIX EFFECT */

const canvas = document.getElementById("matrix")

const ctx = canvas.getContext("2d")

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const letters = "01"

const matrix = letters.split("")

const font_size = 14

const columns = canvas.width / font_size

const drops = []

for(let x = 0; x < columns; x++)
drops[x] = 1

function draw(){

ctx.fillStyle = "rgba(0,0,0,0.05)"

ctx.fillRect(0,0,canvas.width,canvas.height)

ctx.fillStyle = "#0f0"

ctx.font = font_size + "px monospace"

for(let i = 0; i < drops.length; i++){

const text = matrix[Math.floor(Math.random()*matrix.length)]

ctx.fillText(text,i*font_size,drops[i]*font_size)

if(drops[i]*font_size > canvas.height && Math.random() > 0.975)
drops[i] = 0

drops[i]++

}

}

setInterval(draw,35)
