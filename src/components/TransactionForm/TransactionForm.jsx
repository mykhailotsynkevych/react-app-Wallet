import { useState } from "react";

import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import moment from "moment";
import s from "./TransactionForm.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { add } from "../../redux/transactions/transactionsSlice";
import { update } from "../../redux/filter/filterSlice";

import langOptions from "../../utils/options/langOptions";
import { getLanguage } from "../../redux/lang/langSelectors";

// const curDate = new Date().toLocaleDateString().split(".").reverse().join("-");
const curDate = moment().format("YYYY-MM-DD");

// const curTime = new Date().toTimeString().slice(0, 5);
const curTime = moment().format("HH:mm");

const TransactionForm = (props) => {
  const [transaction, setTransaction] = useState(props.selectedTransaction);
  const [date, setDate] = useState(curDate);
  const [time, setTime] = useState(curTime);
  const [category, setCategory] = useState(props.selectedCategory);
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const language = useSelector(getLanguage);

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "transaction":
        setTransaction(value);
        props.handleSelectTransation(value);
        setCategory(transaction === "Expense" ? "Work" : "Food");
        break;
      case "date":
        setDate(value);
        break;
      case "time":
        setTime(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "amount":
        setAmount(Number(value));
        break;
      case "comment":
        setComment(value);
        break;
      default:
        return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount === "") {
      return alert("Please enter the amount");
    }

    const newTransaction = {
      id: nanoid(),
      transaction,
      date,
      time,
      category,
      amount,
      comment,
    };

    dispatch(add(newTransaction));

    resetForm();
  };

  const resetForm = () => {
    // setSearchParams({});
    setTransaction("Expense");
    setDate(curDate);
    setTime(curTime);
    setCategory("Food");
    setAmount("");
    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      name="transactionForm"
      autoComplete="off"
      noValidate
      className={s.transactionForm}
    >
      <p className={s.labelTitle}>{langOptions.transaction[language]}</p>
      <div className={s.radioWrapper}>
        <input
          id="formRadioExpense"
          className={s.input}
          type="radio"
          name="transaction"
          value="Expense"
          checked={transaction === "Expense"}
          onChange={handleChange}
          onClick={() => dispatch(update("Expense"))}
        />
        <label
          className={`${s.radioLabel} ${s.radio}`}
          htmlFor="formRadioExpense"
        >
          {langOptions.expense[language]}
        </label>
        <input
          id="formRadioIncome"
          className={s.input}
          type="radio"
          name="transaction"
          value="Income"
          checked={transaction === "Income"}
          onChange={handleChange}
          onClick={() => dispatch(update("Income"))}
        />
        <label
          className={`${s.radioLabel} ${s.radio}`}
          htmlFor="formRadioIncome"
        >
          {langOptions.income[language]}
        </label>
      </div>

      <div className={s.timeWrapper}>
        <label>
          {langOptions.dateAndTime[language]}
          <input
            type="date"
            name="date"
            defaultValue={date}
            onChange={handleChange}
            className={s.dateText}
          />
        </label>

        <label>
          <input
            type="time"
            name="time"
            defaultValue={time}
            onChange={handleChange}
            className={s.dateText}
          />
        </label>
      </div>

      <div className={s.categoryWrapper}>
        <p className={s.categoryTitle}>{langOptions.category[language]}</p>
        <Link
          to={`/categories/${transaction.toLowerCase()}`}
          className={s.categoryBtnLink}
        >
          <span>{category}</span>
          <span className={s.categoryBtnTriangle}>&#8227;</span>
        </Link>
      </div>

      <label className={s.greybgc}>
        {langOptions.amount[language]}
        <input
          type="number"
          name="amount"
          step="1"
          min="0"
          placeholder="0"
          value={amount}
          onChange={handleChange}
        />
      </label>

      <label>
        <textarea
          type="text"
          name="comment"
          rows="1"
          placeholder={langOptions.comment[language]}
          defaultValue={comment}
          onChange={handleChange}
        ></textarea>
      </label>
      <button type="submit" className={s.formBtnSubmit}>
        {langOptions.add[language]}
      </button>
    </form>
  );
};

export default TransactionForm;
