import { Tab } from "@headlessui/react";
const AccountPage = () => {
	const tabs = ["spreadsheet", "pie"];
	return (
		<div>
			<Tab.Group>
				<Tab.List>
					{tabs.map((tab) => (
						<Tab key={tab}>{tab + "/"}</Tab>
					))}
				</Tab.List>
				<Tab.Panels>
					<Tab.Panel>Profile Content</Tab.Panel>
					<Tab.Panel>Subscription Content</Tab.Panel>
					<Tab.Panel>Settings Content</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
			{/* use to check the window location in demo */}
			{typeof window !== "undefined" && <pre>Current Location : {window.location.href}</pre>}
		</div>
	);
};
export default AccountPage;
