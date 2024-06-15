import MButton from "../../common/MButton.tsx";
import { FormEvent, useEffect, useState } from "react";
import Store from "../../../store/store.ts";
import { Question } from "../../../types/types.ts";
import Answers from "../Answers/Answers.tsx";

const TestComponent = () => {
    const [timer, setTimer] = useState(() => {
        const savedTimer = sessionStorage.getItem('timer');
        return savedTimer ? parseInt(savedTimer, 10) : 300;
    });
    const [active, setActive] = useState(() => {
        const savedActive = sessionStorage.getItem('active');
        return savedActive ? JSON.parse(savedActive) : false;
    });
    const [question, setQuestion] = useState<Question>(() => {
        const savedQuestion = sessionStorage.getItem('question');
        return savedQuestion ? JSON.parse(savedQuestion) : Store.questions[0];
    });
    const [questionsCount, setQuestionsCount] = useState(() => {
        const savedCount = sessionStorage.getItem('questionsCount');
        return savedCount ? parseInt(savedCount, 10) : 1;
    });

    useEffect(() => {
        let interval: number = 0;
        if (active && questionsCount - 1 < Store.questions.length) {
            interval = window.setInterval(() => {
                setTimer((seconds) => seconds - 1);
            }, 1000);
        } else if (!active && timer !== 0 && questionsCount + 1 >= Store.questions.length) {
            clearInterval(interval);
        } else if (questionsCount + 1 == Store.questions.length) {
            interval = timer;
        }
        return () => clearInterval(interval);
    }, [active, questionsCount, timer]);

    useEffect(() => {
        sessionStorage.setItem('timer', timer.toString());
        sessionStorage.setItem('active', JSON.stringify(active));
        sessionStorage.setItem('question', JSON.stringify(question));
        sessionStorage.setItem('questionsCount', questionsCount.toString());
    }, [timer, active, question, questionsCount]);

    const resetTest = () => {
        setTimer(300);
        setActive(false);
        setQuestion(Store.questions[0]);
        setQuestionsCount(1);
        Store.result = [];
        Store.wrongAnswers = [];
        sessionStorage.removeItem('timer');
        sessionStorage.removeItem('active');
        sessionStorage.removeItem('question');
        sessionStorage.removeItem('questionsCount');
    };

    function handleClick(e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (active) {
            setQuestionsCount((prev) => prev + 1);
            const answer: string[] = [];
            const inputs = Array.from(
                e.target instanceof HTMLFormElement ? e.target.elements : [],
            ) as HTMLInputElement[];
            inputs.forEach((el: HTMLInputElement) => {
                if (el.checked || el.type === "text") {
                    answer.push(el.value);
                    el.checked = false;
                    el.value = "";
                }
            });
            const newQuestion = Store.getQuestion(question, answer);
            setQuestion(newQuestion);
            sessionStorage.setItem("question", JSON.stringify(newQuestion));
        } else setActive(true);
    }

    return (
        <div className="test">
            <div className="test__timer">
                <h2>Тестирование</h2>
                <div className="test__timer__value">
                    {timer >= 0
                        ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}`
                        : "0:00"}
                </div>
            </div>
            <div className="test__statusbar">
                {Store.questions.map((question, index) => (
                    <div
                        key={`${question.question} - ${index}`}
                        className={
                            index + 1 <= questionsCount
                                ? index + 1 === questionsCount
                                    ? "active"
                                    : "default"
                                : "disabled"
                        }
                    ></div>
                ))}
            </div>
            <div style={{ visibility: !active ? "hidden" : "visible" }}>
                <h3>{question?.question}</h3>
            </div>
            {timer < 1 ? (
                <div>
                    <h2>К сожалению, ваше время вышло, попробуйте ещё раз!</h2>
                    <MButton onClick={resetTest}>
                        Начать заново
                    </MButton>
                </div>
            ) : active ? (
                <Answers handleClick={handleClick} timer={timer} question={question} />
            ) : (
                <MButton
                    onClick={handleClick}
                    disabled={timer < 1}
                    type="submit"
                >
                    Начать
                </MButton>
            )}
            {questionsCount - 1 >= Store.questions.length && (
                <div className="test__result">
                    <h2>
                        Результат: {Store.result.length}/{Store.questions.length}
                    </h2>
                    <MButton onClick={resetTest}>
                        Начать заново
                    </MButton>
                </div>
            )}
        </div>
    );
};

export default TestComponent;
