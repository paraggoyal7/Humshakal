import React, { useState, useEffect } from 'react';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import { mockNodes } from "./MockData/mockNodes";
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';

Cytoscape.use(fcose);

Cytoscape.use(cola);

export default function CytoscapeTest() {
  const [cy, setCy] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(0);
  const [selectedNode, setSelectedNode] = useState();

  useEffect(() => {
    if (!!selectedNode) {
      console.log("Degree", selectedNode.degree());
    }
  }, [selectedNode])

  let layoutPadding = 50

  const calculateCachedCentrality = () => {
    let nodes = cy.nodes();

    if (nodes.length > 0 && nodes[0].data('centrality') == null) {
      let centrality = cy.elements().closenessCentralityNormalized();

      nodes.forEach(n => n.data('centrality', centrality.closeness(n)));
    }
  };

  let concentric = function (node) {
    if (!cy) {
      return 0
    }
    calculateCachedCentrality();

    return node.data('centrality');
  };
  let levelWidth = function (nodes) {
    if (!cy) {
      return 0
    }
    calculateCachedCentrality();

    let min = nodes.min(n => n.data('centrality')).value;
    let max = nodes.max(n => n.data('centrality')).value;


    return (max - min) / 5;
  };


  // const layout = {
  //   name: 'concentric',
  //   animate: true,
  //   animationDuration: 2000,
  //   fit: true,
  //   boundingBox: {x1:0, y1:0, w: 800, h:600},
  //   concentric: concentric,
  //   levelWidth: levelWidth,
  //   sweep: Math.PI * 2 / 3,
  //   clockwise: true,
  //   startAngle: Math.PI * 1 / 6
  // }

  const layout = {
    name: 'concentric',
    animate: true,
    animationDuration: 2000,
    fit: true,
  }

  // const layout2 = {
  //   name: 'cola',
  //   padding: layoutPadding,
  //   nodeSpacing: 12,
  //   edgeLengthVal: 45,
  //   animate: true,
  //   randomize: true,
  //   maxSimulationTime: 2000,
  //   boundingBox: { // to give cola more space to resolve initial overlaps
  //     x1: 0,
  //     y1: 0,
  //     x2: 10000,
  //     y2: 10000
  //   },
  //   edgeLength: function( e ){
  //     let w = e.data('weight');

  //     if( w == null ){
  //       w = 0.5;
  //     }

  //     return 45 / w;
  //   }
  // }

  const layout2 = {
    name: 'fcose',
    animate: true,
    animationDuration: 2000,
    packComponents: true,
    numIter: 10000,
  }

  const mockElements = mockNodes.map((item, idx) => ([
    { data: { id: item["#node1"], name: item["#node1"], label: item.node1_string_id, score: idx % 5 + 1, gene: true } },
    { data: { id: item["node2"], name: item["node2"], label: item.node2_string_id, score: idx % 5 + 1, gene: true } },
    { data: { source: item["#node1"], target: item["node2"], label: `Edge from ${item.node1_string_id} to ${item.node2_string_id}`, weight: idx % 5 + 1 } }
  ])).flat()

  const stylesheet = [
    {
      selector: 'node',
      style: {
        width: (ele) => { return ele._private.data.r * 10 },
        height: (ele) => { return ele._private.data.r * 10 },
        "background-color": "green",
      },
      label: (ele) => { return ele._private.data.name },
      highlighted: {
        "border-width": "6px",
        "border-color": "#333333",
      },
      start: {
        "border-color": "#8FDC97",
      },
      end: {
        "border-color": "#9F4A54",
      },
    },
    {
      selector: 'edge',
      style: {
        width: (ele) => { return ele._private.data.w * 2 },
      },
      opacity: 0.5,
      highlighted: {
        "line-color": "#008484",
        "width": "9px",
      }
    },

  ]

  const stylesheet2 = [
    {
      "selector": "core",
      "style": {
        "selection-box-color": "#AAD8FF",
        "selection-box-border-color": "#8BB0D0",
        "selection-box-opacity": "0.5"
      }
    },
    {
      "selector": "node",
      "style": {
        "width": "mapData(score, 1, 5, 20, 60)",
        "height": "mapData(score, 1, 5, 20, 60)",
        "label": "data(name)",
        "font-size": "12px",
        "text-valign": "center",
        "text-halign": "center",
        "background-color": "#555",
        "text-outline-color": "#555",
        "text-outline-width": "2px",
        "color": "#fff",
        "overlay-padding": "6px",
        "z-index": "10",
      }
    },
    {
      "selector": "node[?attr]",
      "style": {
        "shape": "rectangle",
        "background-color": "#000000",
        "text-outline-color": "#aaa",
        "text-outline-width": "0px",
        "width": "32px",
        "height": "32px",
        "font-size": "6px",
        "z-index": "1"
      }
    },
    {
      "selector": "node[[degree > 2]]",
      "style": {
        "background-color": "#000000",
      }
    },
    {
      "selector": "node[?query]",
      "style": {
        "background-clip": "none",
        "background-fit": "contain"
      }
    },
    {
      "selector": "node:selected",
      "style": {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.5",
        "background-color": "#77828C",
        "text-outline-color": "#77828C"
      }
    },
    {
      "selector": "edge",
      "style": {
        "curve-style": "straight",
        "haystack-radius": "0.5",
        "opacity": "0.4",
        "line-color": "#bbb",
        "width": "mapData(weight, 1, 5, 1, 5)",
        "overlay-padding": "3px"
      }
    },
    {
      "selector": "node.unhighlighted",
      "style": {
        "opacity": "0.2"
      }
    },
    {
      "selector": "edge.unhighlighted",
      "style": {
        "opacity": "0.05"
      }
    },
    {
      "selector": ".highlighted",
      "style": {
        "z-index": "999999",
        "transition-duration": "0.5s"
      }
    },
    {
      "selector": "node.highlighted",
      "style": {
        "border-width": "8px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.85",
        "background-color": "#394855",
        "text-outline-color": "#394855",
        "shadow-blur": "12px",
        "shadow-color": "#000",
        "shadow-opacity": "0.8",
        "shadow-offset-x": "0px",
        "shadow-offset-y": "4px",
        "transition-property": "border-width, border-color, border-opacity, background-color, text-outline-color, shadow-blur, shadow-color, shadow-opacity, shadow-offset-x, shadow-offset-y"
      }
    },
    {
      "selector": "node.start",
      "style": {
        "border-color": "#8FDC97"
      }
    },
    {
      "selector": "node.end",
      "style": {
        "border-color": "#9F4A54"
      }
    },
    {
      "selector": "edge.filtered",
      "style": {
        "opacity": "0"
      }
    },
    {
      "selector": "edge[group = \"coexp\"]",
      "style": {
        "line-color": "#d0b7d5"
      }
    },
    {
      "selector": "edge[group = \"coloc\"]",
      "style": {
        "line-color": "#a0b3dc"
      }
    },
    {
      "selector": "edge[group = \"gi\"]",
      "style": {
        "line-color": "#90e190"
      }
    },
    {
      "selector": "edge[group = \"path\"]",
      "style": {
        "line-color": "#9bd8de"
      }
    },
    {
      "selector": "edge[group = \"pi\"]",
      "style": {
        "line-color": "#eaa2a2"
      }
    },
    {
      "selector": "edge[group = \"predict\"]",
      "style": {
        "line-color": "#f6c384"
      }
    },
    {
      "selector": "edge[group = \"spd\"]",
      "style": {
        "line-color": "#dad4a2"
      }
    },
    {
      "selector": "edge[group = \"spd_attr\"]",
      "style": {
        "line-color": "#D0D0D0"
      }
    },
    {
      "selector": "edge[group = \"reg\"]",
      "style": {
        "line-color": "#D0D0D0"
      }
    },
    {
      "selector": "edge[group = \"reg_attr\"]",
      "style": {
        "line-color": "#D0D0D0"
      }
    },
    {
      "selector": "edge[group = \"user\"]",
      "style": {
        "line-color": "#f0ec86"
      }
    },
    {
      "selector": "node[?social]",
      "style": {
        "width": 30,
        "height": 30,
        "background-image": "data(image)",
        "background-fit": "cover"
      }
    },
    {
      "selector": "node[?social]:selected",
      "style": {
        "border-width": 4,
        "border-opacity": 0.8
      }
    },
    {
      "selector": "edge[?social]",
      "style": {
        "width": 3,
        "line-color": "#888",
        "opacity": 0.4,
        "haystack-radius": 0
      }
    },
    {
      "selector": "edge.highlighted",
      "style": {
        "line-color": "#AAD8FF",
        "width": "10px"
      }
    }
  ]

  console.log(cy, selectedLayout);



  const handleLayoutChange = () => {
    let computedLayout = cy.layout(selectedLayout === 1 ? layout2 : layout)
    computedLayout.run()
    setSelectedLayout((prev) => prev === 1 ? 0 : 1)
    console.log("Max Degree", cy.nodes().maxDegree());
  }

  if (!!cy) {
    cy.on('tap', function (evt) {
      const node = evt.target;
      console.log("evt", node);
      if (node === cy) {
        setSelectedNode(null)
      }
      else {
        console.log('tapped ' + node.id() + "  " + node.degree());
        setSelectedNode(node);
      }
    });
  }

  return (
    <>
      <div style={{ width: '800px', height: '800px', backgroundColor: "grey", margin: "100px auto 0px auto" }}>
        <CytoscapeComponent
          elements={mockElements}
          style={{ width: '800px', height: '800px' }}
          layout={layout}
          stylesheet={stylesheet2}
          minZoom={0.1}
          maxZoom={5}
          cy={(cy) => { setCy(cy) }}
        />
        <button onClick={handleLayoutChange} style={{ margin: "8px" }}>Change Layout</button>
        {!!selectedNode && (
          <div style={{ display: "inline", margin: "8px" }}>Degree: {selectedNode.degree()}</div>
        )}
      </div>
    </>
  );
}