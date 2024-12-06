import type { RouterOutput } from '../../utils/trpc';

interface Props {
	log: RouterOutput['runLogs']['getRunLogs'][number];
}

export const RunLogItem: React.FC<Props> = ({ log }) => <div>{JSON.stringify(log)}</div>;
