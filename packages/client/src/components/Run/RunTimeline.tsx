/* eslint-disable react/no-array-index-key */
import { DownOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Tree, type TreeDataNode } from 'antd';
import type { Step } from './run.types';

const { DirectoryTree } = Tree;

interface Props {
	data: {
		steps: Step[];
		titlePath: string[];
	}[];
}

export const RunTimeline: React.FC<Props> = ({ data }) => {
	console.log(data);
	const walkTree = (d: Step[], deep = 0): TreeDataNode[] =>
		d.map((item, i) => ({
			title: item.title,
			key: `${item.title}#${deep}#${i}`,
			children: walkTree(item.steps, deep + 1),
			isLeaf: !item.steps?.length,
		}));

	return (
		<DirectoryTree
			showLine
			switcherIcon={<DownOutlined />}
			treeData={walkTree(data.map(item => item.steps).flat())}
			icon={false}
			className={css`
				.ant-tree-node-content-wrapper {
					height: 50px;
					display: flex;
					align-items: center;
				}

				.ant-tree-switcher {
					height: 50px;
					display: flex;
					align-items: center;
				}
			`}
		/>
	);
};
