import MButton from "../../common/MButton.tsx";
import { FormEvent, useRef, useState } from "react";
import { Question } from "../../../types/types.ts";
import Store from "../../../store/store.ts";

const AddQuestion = ({
    setShowAddQuestion,
}: {
    setShowAddQuestion: (res: boolean) => void;
}) => {
    const answersRef = useRef<HTMLDivElement | null>(null);
    const [manyAnswers, setManyAnswers] = useState({ status: "", count: 1 });

    function addAnswers() {
        if (answersRef.current)
            answersRef.current.innerHTML += `<input id="options" placeholder='Вариант ответа'/>`;
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data: Question = {
            options: [],
            answer: [],
            question: "",
            type: "",
        };

        const inputs = Array.from(
            e.target instanceof HTMLFormElement ? e.target.elements : [],
        ) as HTMLInputElement[];
        inputs.forEach((el: HTMLInputElement) => {
            if (el.type === "radio" && el.checked) {
                data.type = el.id;
            }
            if (el.id === "options") {
                data.options.push(el.value);
            }
            if (el.id === "question") {
                data.question = el.value;
            }
            if (el.id === "answer") {
                if (manyAnswers.status === "checkbox") {
                    Array.from(data.answer).push(el.value);
                } else data.answer = el.value;
            }
        });
        Store.setNewQuestion(data);
    }

    return (
        <form onSubmit={handleSubmit} className="form__add__question">
            <h2>Тип вопроса</h2>
            <div className="form__add__question__variation">
                <input
                    type="radio"
                    name="type"
                    id="radio"
                    onChange={() => setManyAnswers({ ...manyAnswers, status: "radio" })}
                />
                <label>Один вариант ответа</label>
            </div>
            <div className="form__add__question__variation">
                <input
                    type="radio"
                    name="type"
                    id="text"
                    onChange={() => setManyAnswers({ ...manyAnswers, status: "text" })}
                />
                <label>Текст</label>
            </div>
            <div className="form__add__question__variation">
                <input
                    type="radio"
                    name="type"
                    id="textArea"
                    onChange={() => setManyAnswers({ ...manyAnswers, status: "text" })}
                />
                <label>Большое поле ввода</label>
            </div>
            <div className="form__add__question__variation">
                <input
                    type="radio"
                    name="type"
                    id="checkebox"
                    onChange={() =>
                        setManyAnswers({ ...manyAnswers, status: "checkbox" })
                    }
                />
                <label>Несколько вариантов выбора</label>
            </div>
            <div>
                <p>Напишите вопрос</p>
                <input id="question" />
            </div>
            <div>
                <p>Напишите правильный ответ</p>
                {manyAnswers ? (
                    new Array(manyAnswers.count)
                        .fill(null)
                        .map((_, index) => <input key={index} id="answer" />)
                ) : (
                    <input id="answer" />
                )}
            </div>
            <div ref={(node) => (answersRef.current = node)}></div>
            {manyAnswers.status == "checkbox" && (
                <MButton
                    type="button"
                    onClick={() =>
                        setManyAnswers((prev) => ({ ...prev, count: prev.count + 1 }))
                    }
                >
                    Добавить вариант правильного ответа
                </MButton>
            )}
            {manyAnswers.status != "text" && (
                <MButton type="button" onClick={addAnswers}>
                    Добавить вариант ответа
                </MButton>
            )}
            <MButton type="submit">Добавить вопрос в тест</MButton>
            <MButton type="button" onClick={() => setShowAddQuestion(false)}>
                Вернуться назад
            </MButton>
        </form>
    );
};

export default AddQuestion;
