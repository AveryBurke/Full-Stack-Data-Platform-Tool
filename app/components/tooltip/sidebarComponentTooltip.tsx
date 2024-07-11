import useTooltip from "@/app/hooks/useTooltip";

const SidebarComponentTooltip: React.FC = () => {

    const { tooltipOpen, tooltipIsVisible, tooltipCoords, Portal } = useTooltip();

    const TT = (
        <Portal>
           	const TT = (
		<div className={"transition-opacity duration-200 " + (tooltipIsVisible ? "opacity-100" : "opacity-0")}>
			<ToolTip coords={tooltipCoords} alignment={sidebarComponentOptions?.tooltip?.alignment || { x: "right", y: "center" }}>
				{sidebarComponentOptions?.tooltip?.header && <h3 className="font-bold text-center">{sidebarComponentOptions.tooltip.header}</h3>}
				{sidebarComponentOptions?.tooltip?.body?.length! > 0 && <hr className="my-2" />}
				{sidebarComponentOptions?.tooltip?.body?.map((line, index) => (
					<span key={index} className="text-sm text-slate-600">
						{line}
					</span>
				))}
			</ToolTip>
		</div>
	);
        </Portal>
    );
    )

}

export default SidebarComponentTooltip;