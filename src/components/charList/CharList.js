import { useEffect, useState, useRef, useMemo } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const setContent = (process, Component, newItemLoading) => {
	switch (process) {
		case 'waiting':
			return <Spinner />;
		case 'loading':
			return newItemLoading ? <Component /> : <Spinner />;
		case 'confirmed':
			return <Component />;
		case 'error':
			return <ErrorMessage />;
		default:
			throw new Error('Unexpected process state');
	}
}

const CharList = (props) => {
	const [charList, setCharList] = useState([]);
	const [newItemLoading, setnewItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const { getAllCharacters, process, setProcess } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
		// eslint-disable-next-line
	}, [])

	//load on scroll

	// useEffect(() => {
	// 	window.addEventListener('scroll', onScroll);
	// 	return () => window.removeEventListener('scroll', onScroll);
	// }, [offset]);


	// const onScroll = () => {
	// 	if (charEnded) window.removeEventListener('scroll', onScroll);
	// 	if (window.pageYOffset + document.documentElement.clientHeight >=
	// 		(document.documentElement.scrollHeight) && offset >= 219) {
	// 		onRequest(offset);
	// 	}
	// };

	const onRequest = (offset, initial) => {
		initial ? setnewItemLoading(false) : setnewItemLoading(true);
		getAllCharacters(offset)
			.then(onCharListLoaded)
			.then(() => setProcess('confirmed'));
	}

	const onCharListLoaded = async (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}
		setCharList([...charList, ...newCharList]);
		setnewItemLoading(false);
		setOffset(offset + 9);
		setCharEnded(ended);
	}

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current[id].focus();
	}

	const renderItems = (arr) => {
		const items = arr.map((item, i) => {

			if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif") {
				item.thumbnail = mjolnir;
			}

			return (
				<li
					className="char__item"
					tabIndex={0}
					ref={el => itemRefs.current[i] = el}
					key={item.id}
					onClick={() => {
						props.onCharSelected(item.id);
						focusOnItem(i);
					}}
					onKeyUp={(e) => {
						if (e.key === 'Tab') {
							props.onCharSelected(item.id);
							focusOnItem(i);
						}
					}}>
					<img src={item.thumbnail} alt={item.name} />
					<div className="char__name">{item.name}</div>
				</li>
			)
		});
		// А эта конструкция вынесена для центровки спиннера/ошибки
		return (
			<ul className="char__grid">
				{items}
			</ul>
		)
	}

	const elements = useMemo(() => {
		return setContent(process, () => renderItems(charList), newItemLoading);
		// eslint-disable-next-line
	}, [process])

	return (
		<div className="char__list">
			{elements}
			<button
				disabled={newItemLoading}
				style={{ 'display': charEnded ? 'none' : 'block' }}
				className="button button__main button__long"
				onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

export default CharList;
