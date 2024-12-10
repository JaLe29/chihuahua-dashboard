import { useState } from 'react';

export const useUrlHash = () => {
	const [hash] = useState(window.location.hash.slice(1));

	const setHash = (newHash: string) => {
		const url = new URL(window.location.href);

		url.hash = `#${newHash}`;
		window.history.replaceState({}, '', url.toString());
	};

	return { hash, setHash };
};
