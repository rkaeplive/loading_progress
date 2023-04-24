import React, { useRef, useEffect, useState } from "react";
import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import BimatterLoader from "../Loader/BimatterLoader";
import ViewCubeContainer from "../ViewerCube/ViewCubeContainer";
import cl from "./Viewer.module.css";
function Viewer() {
    const viewerDiv = useRef();
    const [viewer, setViewer] = useState(null);
    const [model, setModel] = useState(null);
    const [loading, setIsLoading] = useState(true);
    useEffect(() => {
        const container = viewerDiv.current;

        const viewer = new IfcViewerAPI({
            container,
            backgroundColor: new Color(0xffffff),
        });

        viewer.axes.setAxes();
        viewer.grid.setGrid();
        container.onclick = () => viewer.IFC.selector.pickIfcItem(true);
        container.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
        viewer.clipper.active = true;
        const setProgress = (event) => {
            const progress = Math.floor((event.loaded / event.total) * 100);
            console.log(progress);
            const parent = document.getElementById("loadingProgres");
            parent.innerHTML = progress + "%";
        };
        viewer.IFC.loader.ifcManager.setOnProgress(setProgress);
        container.onkeydown = (event) => {
            if (event.code === "KeyP") {
                viewer.clipper.createPlane();
            } else if (event.code === "KeyO") {
                viewer.clipper.deletePlane();
            }
        };
        container.ondblclick = () => {
            viewer.context.fitToFrame();
        };
        container.oncontextmenu = () => {
            viewer.IFC.selector.unpickIfcItems();
        };
        async function loadIfc(url) {
            const model = await viewer.IFC.loadIfcUrl(url, true);
            setModel(model);
            setViewer(viewer);
            setTimeout(() => {
                setIsLoading(false);
            }, 5000);
        }

        viewer.IFC.setWasmPath("../../../");
        loadIfc("models/test.ifc");
    }, []);
    return (
        <div id={cl.viewer_container} ref={viewerDiv}>
            {loading && <BimatterLoader></BimatterLoader>}
            <ViewCubeContainer
                viewer={viewer}
                model={model}
            ></ViewCubeContainer>
        </div>
    );
}

export default Viewer;
