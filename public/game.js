let questionNumber = 0;
let score = 0;
let totalScore = 0;
let totalAnswered = 0;
let rightAnswer = ""
let playerId = document.getElementById("gameId").innerText
playerId = parseInt(playerId, 10)

if(playerId == 0) {
    alert(location.href + "\nPlease Login");
    location.href = "/";
}


window.onload = async () => {
    await getScore().then(allScores => {
        const lbDiv = document.getElementById("leaderboardData")
        const scoreTotal = document.getElementById("totals")
        const totalElm = document.createElement("p")


        console.log(allScores)

        for(let i = 0; i < allScores.length; i++) {
            if(allScores[i].login_id === playerId) {
                const scoreData = allScores[i]
                totalScore += scoreData.total_correct
                totalAnswered += scoreData.total_correct + scoreData.total_wrong
            }
        }

        if(totalScore != 0) {
            totalElm.innerText = `Total Correct/Total Answered: ${totalScore} / ${totalAnswered} or ${Math.round(totalScore/totalAnswered * 100)}%`
            scoreTotal.appendChild(totalElm)
        }

        for(let i = allScores.length - 1 ; i >= allScores.length - 5; i--) {
            if(allScores[i].login_id === playerId) {
                const scoreElm = document.createElement("p")
                const scoreData = allScores[i]
                scoreElm.innerText = `Username: ${scoreData.Name} | Difficulty: ${scoreData.difficulty} | Category: ${scoreData.category} | Score: ${scoreData.total_correct} / ${scoreData.total_correct + scoreData.total_wrong}`
                lbDiv.appendChild(scoreElm)
            }
        }
    })
    console.log("hi")
}


const removeClass = () => {
   document.getElementById('startBox').style.display = "block"
   retrieve()
   questionNumber = 0
   score = 0
}

async function getData() {
    let response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple')
    response = await response.json()
    return response
}

async function getScore() {
    let response = await fetch('http://localhost:8000/score')
    response = await response.json()
    return response
}

async function postScore(newScore) {
    let response = await fetch('http://localhost:8000/score', { method:'post', body: JSON.stringify(newScore), headers: {'Content-Type': 'application/json'}} )
    response = await response.json()
    return response
}

const retrieve = () => {
    document.getElementById("answer1").classList.remove('btn-danger','btn-success');
    document.getElementById("answer1").classList.add('btn-outline-primary');
    
    document.getElementById("answer2").classList.remove('btn-danger','btn-success');
    document.getElementById("answer2").classList.add('btn-outline-primary');

    document.getElementById("answer3").classList.remove('btn-danger','btn-success');
    document.getElementById("answer3").classList.add('btn-outline-primary');

    document.getElementById("answer4").classList.remove('btn-danger','btn-success');
    document.getElementById("answer4").classList.add('btn-outline-primary');


    getData().then((value) => {
        trivia(value)
    })
}

document.getElementById("find").addEventListener("click", removeClass)

const trivia = (data) => {
    console.log(data)
    const totalNum = document.getElementById("num").value
    let diff = document.getElementById('difficult').value
    let cat = document.getElementById('trivia_category').value
    if(totalNum == 0 || cat == "Select" || diff == "Select") {
        alert("Please enter your question data")
        return ""
    }
    if (questionNumber <= totalNum - 1) {
        for(let i = 0; i < data.results.length; i++) {
            if((data.results[i].difficulty == diff) && (data.results[i].category == cat)) {
                rightAnswer = data.results[i].correct_answer
                let incorrectAnswer = data.results[i].incorrect_answers
                let list = incorrectAnswer
                list.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, rightAnswer)
                questions = data.results[i].question

                document.getElementById("question").innerHTML = `<strong>Question:</strong> ${questions}`

                let answer1 = list[0]
                let answer2 = list[1]
                let answer3 = list[2]
                let answer4 = list[3]

                document.querySelector("#answer1").innerHTML = answer1
                document.querySelector("#answer2").innerHTML = answer2
                document.querySelector("#answer3").innerHTML = answer3
                document.querySelector("#answer4").innerHTML = answer4

                document.getElementById("difficulty").innerHTML = "<strong>Difficulty:</strong> " + data.results[i].difficulty


                reset()

                document.getElementById('answer1').disabled = false;
                document.getElementById('answer2').disabled = false;
                document.getElementById('answer3').disabled = false;
                document.getElementById('answer4').disabled = false;

                document.getElementById("score").innerHTML = `<strong>Score:</strong> ${score}/${questionNumber}`

                break;
            } 
        }
        questionNumber++
    } else {
        document.getElementById("score").innerHTML = `<strong>Score:</strong> ${score}/${questionNumber}`
        let myModal = new bootstrap.Modal(
            document.getElementById("userMessageContainer"),
            {}
        );
        myModal.show();
        document.getElementById('usermessage').innerHTML = `Game over. You have answered ${questionNumber} questions. You got ${Math.floor(score/(questionNumber) * 100)}% right!`
        if(cat != "Select" && diff != "Select") {
            postScore({loginID: playerId, difficulty: document.getElementById('difficult').value , correctQuestions: score, incorrectQuestion: questionNumber - score, trivia_category: cat})
        }
    }
}


const checkAnswer1 = () => {
    if(rightAnswer === document.getElementById("answer1").textContent) {
        score++
        document.getElementById("rightwrong").innerHTML = "You selected the correct answer"
        document.getElementById("answer1").classList.remove('btn-outline-primary')
        document.getElementById("answer1").classList.add('btn-success');

    } else {
        document.getElementById("rightwrong").innerHTML = "You selected the incorrect answer. The correct answer is: " + rightAnswer
        document.getElementById("answer1").classList.remove('btn-outline-primary')
        document.getElementById("answer1").classList.add('btn-danger');

    }

    document.getElementById('answer1').disabled = true;
    document.getElementById('answer2').disabled = true;
    document.getElementById('answer3').disabled = true;
    document.getElementById('answer4').disabled = true;
}

const checkAnswer2 = () => {
    if(rightAnswer === document.getElementById("answer2").textContent) {
        score++
        document.getElementById("rightwrong").innerHTML = "You selected the correct answer"
        document.getElementById("answer2").classList.remove('btn-outline-primary')
        document.getElementById("answer2").classList.add('btn-success');

    } else {
        document.getElementById("rightwrong").innerHTML = "You selected the incorrect answer. The correct answer is: " + rightAnswer
        document.getElementById("answer2").classList.remove('btn-outline-primary')

        document.getElementById("answer2").classList.add('btn-danger');

    }

    document.getElementById('answer1').disabled = true;
    document.getElementById('answer2').disabled = true;
    document.getElementById('answer3').disabled = true;
    document.getElementById('answer4').disabled = true;
}

const checkAnswer3 = () => {
    if(rightAnswer === document.getElementById("answer3").textContent) {
        score++
        document.getElementById("rightwrong").innerHTML = "You selected the correct answer"
        document.getElementById("answer3").classList.remove('btn-outline-primary')
        document.getElementById("answer3").classList.add('btn-success');

    } else {
        document.getElementById("rightwrong").innerHTML = "You selected the incorrect answer. The correct answer is: " + rightAnswer
        document.getElementById("answer3").classList.remove('btn-outline-primary')
        document.getElementById("answer3").classList.add('btn-danger');
    }

    document.getElementById('answer1').disabled = true;
    document.getElementById('answer2').disabled = true;
    document.getElementById('answer3').disabled = true;
    document.getElementById('answer4').disabled = true;
}

const checkAnswer4 = () => {
    if(rightAnswer === document.getElementById("answer4").textContent) {
        score++
        document.getElementById("rightwrong").innerHTML = "You selected the correct answer"
        document.getElementById("answer4").classList.remove('btn-outline-primary')
        document.getElementById("answer4").classList.add('btn-success');


    } else {
        document.getElementById("rightwrong").innerHTML = "You selected the incorrect answer. The correct answer is: " + rightAnswer
        document.getElementById("answer4").classList.remove('btn-outline-primary')
        document.getElementById("answer4").classList.add('btn-danger');

    }
    document.getElementById('answer1').disabled = true;
    document.getElementById('answer2').disabled = true;
    document.getElementById('answer3').disabled = true;
    document.getElementById('answer4').disabled = true;
}

const restartGame = () => {
    document.getElementById('usermessage').innerHTML = ''
    retrieve()
    questionNumber = 0
    score = 0
    document.getElementById('startBox').style.display = "none"

    location.reload()

}

const reset = () => {
    document.getElementById("rightwrong").innerHTML = "" 
}