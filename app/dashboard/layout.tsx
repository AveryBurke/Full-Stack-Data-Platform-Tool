import React from 'react'
import ResizablePane from '@/app/components/resizableWindows/ResizableWindow'

interface LayoutProps {
  children: React.ReactNode,
  codeEditor: React.ReactNode,
  sidebar: React.ReactNode,
  tabs: React.ReactNode
  input: React.ReactNode
}

const layout:React.FC<LayoutProps> = ({children, codeEditor, sidebar, tabs, input}) => {
  return (
    <div className={`realtive h-screen w-screen flex-grow flex flex-row`}>
			<ResizablePane minSize={0} initialSize={150} maxSize={150} growDirection="right" bgColor={"bg-[#282a36]"} additionalStyles="border-r-2 border-opacity-50 border-[#abb2bf]" >
				{sidebar}
			</ResizablePane>
			<div className={`h-screen w-screen flex-grow flex flex-col`}>
				<ResizablePane minSize={0} initialSize={200} maxSize={1000} vertical bgColor={"bg-[#282a36]"}>
					{input}
				</ResizablePane>
				<ResizablePane
					minSize={0}
					initialSize={200}
					grow
					vertical
					bgColor={"bg-[#282a36]"}
					additionalStyles="z-10 border-t-2 border-opacity-50 border-[#abb2bf]">
					{codeEditor}
				</ResizablePane>
			</div>
			<ResizablePane
				minSize={150}
				initialSize={800}
				maxSize={1280}
				growDirection="left"
				bgColor={"bg-[#282a36]"}
				additionalStyles="z-0 border-l-2 border-opacity-50 border-[#abb2bf]">
				{tabs}
			</ResizablePane>
		</div>
  )
}

export default layout