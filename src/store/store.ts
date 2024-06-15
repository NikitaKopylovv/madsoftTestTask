import { makeAutoObservable } from "mobx";
import { Question } from "../types/types";

function arraysEqualUnordered(arr1: string[], arr2: string[]) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }
    return true;
}

class Store {
    constructor() {
        makeAutoObservable(this);
        this.shuffle(this.questions);
    }

    shuffle(questions: Question[]): void {
        let currentIndex = questions.length;
        while (currentIndex != 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [questions[currentIndex], questions[randomIndex]] = [
                questions[randomIndex],
                questions[currentIndex],
            ];
        }
    }

    result: Question[] = [];
    wrongAnswers: Question[] = [];

    questions: Question[] = [
        {
            question: "Что означает аббревиатура HTML?",
            answer: "HyperText Markup Language",
            options: [
                "HyperText Markup Language",
                "HyperText Main Language",
                "HyperText Machine Language",
            ],
            type: "radio",
        },
        {
            question:
                "Какой метод используется для добавления элемента в конец массива?",
            answer: "push()",
            options: ["pop()", "push()", "shift()"],
            type: "radio",
        },
        {
            question: "Какое CSS-свойство используется для изменения цвета текста?",
            answer: ["color"],
            options: ["color", "var", "const"],
            type: "checkbox",
        },
        {
            question:
                "Какой оператор используется для объявления переменной в JavaScript?",
            answer: ["let", "var", "const"],
            options: ["let", "var", "const"],
            type: "checkbox",
        },
        {
            question:
                "Какое значение свойства visibility делает элемент невидимым, но оставляет пространство для него?",
            answer: "hidden",
            options: [],
            type: "text",
        },
        {
            question:
                "Какой тег используется для вставки изображения? (Ответ запишите в виде <тег>)",
            answer: "<img>",
            options: [],
            type: "textArea",
        },
        {
            question: "Что означает аббревиатура CSS?",
            answer: "Cascading Style Sheets",
            options: [
                "Creative Style Sheets",
                " Computer Style Sheets",
                "Cascading Style Sheets",
            ],
            type: "radio",
        },
        {
            question: "Какой тег используется для создания нумерованного списка в HTML? (Ответ запишите в виде <тег>)",
            answer: "<ol>",
            options: [
                "<ol>",
                "<ul>",
                "<li>"
            ],
            type: "radio"
        },
    ];

    getQuestion(currentQuestion: Question, answer: string[]): Question {
        if (
            currentQuestion.type === "checkbox" &&
            arraysEqualUnordered(answer, currentQuestion.answer as string[])
        ) {
            this.result.push(currentQuestion);
        } else if (answer[0] === currentQuestion.answer && currentQuestion.type !== "checkbox") {
            this.result.push(currentQuestion);
        } else {
            this.wrongAnswers.push(currentQuestion);
        }
        const currentIndex = this.questions.indexOf(currentQuestion);
        const nextQuestion = this.questions[currentIndex + 1] || null;
        return nextQuestion;
    }

    setNewQuestion(question: Question) {
        this.questions.push(question);
        this.shuffle(this.questions);
    }
}

export default new Store();
