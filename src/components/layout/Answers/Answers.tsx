import { FormEvent } from "react";
import { Question } from "../../../types/types";
import MButton from "../../common/MButton";

interface AnswersPropsI {
    handleClick: (e: FormEvent<HTMLFormElement>) => void;
    question: Question;
    timer: number;
}

const Answers = ({ handleClick, question, timer }: AnswersPropsI) => {
    return (
        <div>
            {question && (
                <form onSubmit={handleClick} className="test__answers">
                    {question.options.length > 0 ? (
                        question?.options.map((option) => (
                            <div key={option} className="test__answer">
                                <input name="answer" type={question.type} value={option} />
                                <p>{option}</p>
                            </div>
                        ))
                    ) : question?.type === "text" ? (
                        <input name="answer" type={question?.type} />
                    ) : (
                        <input type="text"></input>
                    )}
                    <MButton disabled={timer < 1} type="submit">
                        Ответить
                    </MButton>
                </form>
            )}
        </div>
    );
};

export default Answers;
