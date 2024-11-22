/* eslint-disable react/no-unstable-nested-components */
import { CrownFilled, GithubFilled, LogoutOutlined } from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import { ProConfigProvider, ProLayout } from '@ant-design/pro-components';
import { ConfigProvider, Dropdown } from 'antd';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NoStyleLink } from './components/NoStyleLink';
import { useActiveProject } from './hooks/useActiveProject';
import { useProjects } from './hooks/useProjects';

const SETTINGS: Partial<ProSettings> = {
	fixSiderbar: true,
	layout: 'mix',
	splitMenus: true,
	title: 'Chihuahua Dashboard',
};

const SearchInput = ({ isMobile }: { isMobile: boolean }) => {
	const { activeProjectName, initialized } = useActiveProject();

	return (
		<div
			key="SearchOutlined"
			aria-hidden
			style={{
				display: 'flex',
				alignItems: 'center',
				marginInlineEnd: isMobile ? undefined : 24,
			}}
			onMouseDown={e => {
				e.stopPropagation();
				e.preventDefault();
			}}
		>
			{!initialized ? 'Loading' : activeProjectName || 'No active project'}
		</div>
	);
};

export const InAppLayout: React.FC = () => {
	const { projects } = useProjects();

	const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');

	if (typeof document === 'undefined') {
		return <div />;
	}

	return (
		<div
			id="test-pro-layout"
			style={{
				height: '100vh',
				overflow: 'auto',
			}}
		>
			<ProConfigProvider hashed={false}>
				<ConfigProvider getTargetContainer={() => document.getElementById('test-pro-layout') || document.body}>
					<ProLayout
						prefixCls="my-prefix"
						route={{
							path: '/',
							routes: [
								{
									path: '/list',
									routes: [
										{
											path: '/',
											name: 'Home',
											routes: [
												{
													name: 'Projects',
													icon: <CrownFilled />,
													path: '/projects',
													routes: projects?.map(project => ({
														path: `/project/${project.id}`,
														name: <NoStyleLink to="/project">{project.name}</NoStyleLink>,
													})),
												},
												{
													path: 'sub-sub-page2',
													name: '2',
													icon: <CrownFilled />,
													component: './Welcome',
												},
												{
													path: 'sub-sub-page3',
													name: '3',
													icon: <CrownFilled />,
													component: './Welcome',
												},
											],
										},
										{
											path: '/list/sub-page2',
											name: '4',
											icon: <CrownFilled />,
											component: './Welcome',
										},
										{
											icon: <CrownFilled />,
											path: '/settings',
											name: <NoStyleLink to="/settings">Settings</NoStyleLink>,
										},
										{
											icon: <CrownFilled />,
											path: '/config',
											name: <NoStyleLink to="/config">Config</NoStyleLink>,
										},
									],
								},
							],
						}}
						location={{
							pathname,
						}}
						token={{
							header: {
								colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
							},
						}}
						siderMenuType="group"
						menu={{
							collapsedShowGroupTitle: true,
						}}
						avatarProps={{
							src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
							size: 'small',
							title: 'Jakub',
							render: (props, dom) => (
								<Dropdown
									menu={{
										items: [
											{
												key: 'logout',
												icon: <LogoutOutlined />,
												label: 'Logout',
											},
										],
									}}
								>
									{dom}
								</Dropdown>
							),
						}}
						actionsRender={props => {
							if (props.isMobile) {
								return [<SearchInput isMobile={props.isMobile} key="SearchInput" />];
							}

							if (typeof window === 'undefined') {
								return [];
							}

							return [
								<SearchInput isMobile={false} key="SearchInput" />,
								<GithubFilled key="GithubFilled" />,
							];
						}}
						headerTitleRender={(logo, title, _) => {
							const defaultDom = (
								<NoStyleLink to="/">
									{logo}
									{title}
								</NoStyleLink>
							);
							if (typeof window === 'undefined') {
								return defaultDom;
							}

							if (document.body.clientWidth < 1400) {
								return defaultDom;
							}

							if (_.isMobile) {
								return defaultDom;
							}

							return <>{defaultDom}</>;
						}}
						menuFooterRender={props => {
							if (props?.collapsed) {
								return undefined;
							}

							return (
								<div
									style={{
										textAlign: 'center',
										paddingBlockStart: 12,
									}}
								>
									<div>© 2024 Made with ❤️</div>
									<div>by JaLe</div>
								</div>
							);
						}}
						menuItemRender={(item, dom) => (
							<div
								onClick={() => {
									setPathname(item.path || '/welcome');
								}}
							>
								{dom}
							</div>
						)}
						{...SETTINGS}
					>
						<Outlet />
					</ProLayout>
				</ConfigProvider>
			</ProConfigProvider>
		</div>
	);
};
