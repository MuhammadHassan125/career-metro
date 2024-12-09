import * as d3 from 'd3';


const calculatePositions = (steps, centerY, depth = 0, branchIndex = 0, parentIndex = 0, parentX = 0) => {
    const nodeDistance = 110;
    const branchDistance = 80;

    return steps.map((step, index) => {
        const x = index === 0 ? parentX + nodeDistance : parentX + (index + 1) * nodeDistance;
        const y = depth === 0
            ? centerY
            : parentIndex % 2 === 0
                ? branchIndex % 2 === 0
                    ? centerY - (parentIndex - (branchIndex + depth)) * branchDistance
                    : centerY + (parentIndex - ((branchIndex - 1) + depth)) * branchDistance
                : branchIndex % 2 === 0
                    ? centerY - (parentIndex - (branchIndex + depth)) * branchDistance
                    : centerY + (parentIndex - ((branchIndex - 1) + depth)) * branchDistance;
        return {
            ...step,
            x,
            y,
        };
    });
};

const processSteps = (steps, width, height, color, branchIndex = 0, parent = null, parentIndex = 0, depth = 0, parentX = 0) => {

    const nodes = [];
    const links = [];
    const branches = [];

    const positionedSteps = calculatePositions(steps, height / 2.5, depth, branchIndex, parentIndex, parentX);

    positionedSteps.forEach((step, index) => {
        nodes.push({
            id: step.id,
            title: step.title,
            description: step.description,
            skills: step.skills,
            x: step.x,
            y: step.y,
            color: color,
            parentIndex: index
        });
        if (parent && index === 0) {
            links.push({
                source: parent.id,
                target: step.id,
                color
            });
        } else if (nodes.length > 1) {
            links.push({
                source: nodes[depth * index].id,
                target: step.id,
                color
            });
        }
        if (step.branches) {
            step.branches.forEach((branch, branchIndex) => {
                branches.push({
                    branch_id: branch.id,
                    allSteps: [step, ...branch.steps],
                    color: branch.color,
                    steps: branch.steps,
                });
                const {
                    nodes: subNodes,
                    links: subLinks,
                    branches: subBranches
                } = processSteps(branch.steps, width, height, branch.color, branchIndex, step, index, depth + 1, step.x);
                nodes.push(...subNodes);
                links.push(...subLinks);
                branches.push(...subBranches);
            });
        }
    });

    return { nodes, links, branches };
};


const DrawBranch = (svg, branch, width, height, setGetTitle, setGetDescription, setGettingSkillsData) => {

    if (!svg) throw new Error('svg required as HTMLElement');
    if (typeof branch !== 'object') throw new Error('branch requires an object');

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('padding', '8px')
        .style('background', '#3749A6')
        .style('color', 'white')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('visibility', 'hidden')
        .style('pointer-events', 'none');

    const tooltipWidth = 120;
    const tooltipHeight = 40;

    const { nodes, links, branches } = processSteps(branch.steps, width, height, branch.color);

    const wrapText = (svg, text, x, y, fontSize, Color, Bold, splitText, movingRight, lineValue, RightShift, LeftShift) => {
        const lineHeight = 12;
    
        if (!splitText) {
            const words = text.split(' ');
            let displayText = text;
            
           
            if (words.length > 2) {
                displayText = words.slice(0, 5).join(' ') + '...';
            }
    
            svg.append('text')
                .attr('x', x + (RightShift !== 0 ? RightShift : LeftShift))
                .attr('y', y + 15)
                .attr('text-anchor', 'middle')
                .attr('fill', Color)
                .style('font-weight', Bold)
                .style('font-size', fontSize)
                .text(displayText);
                
            if (displayText !== text) {
                svg.append('title').text(text);
            }
            return;
        }
    
        const words = text.split(' ');
        const lines = [];
        
        if (words.length > 5) {
            const firstLine = words.slice(0, 2).join(' ');
            const secondLine = words.slice(2, 4).join(' ') + '...';
            lines.push(firstLine, secondLine);
        } else {
            for (let i = 0; i < words.length; i += 2) {
                const lineWords = words.slice(i, i + 2);
                lines.push(lineWords.join(' '));
            }
        }
    
        // Render each line
        lines.forEach((line, i) => {
            svg.append('text')
                .attr('x', x)
                .attr('y', y + i * lineHeight + lineValue)
                .attr('text-anchor', 'middle')
                .attr('fill', Color)
                .style('font-weight', Bold)
                .style('font-size', fontSize)
                .text(line);
        });
    
        if (words.length > 4) {
            svg.append('title').text(text);
        }
    };

    
    svg.selectAll('path.connection')
        .data(links)
        .enter().append('path')
        .attr('class', 'connection')
        .attr('d', d => {
            const source = nodes.find(n => n.id === d.source);
            const target = nodes.find(n => n.id === d.target);

            const midX = (source.x + target.x) / 2;
            const controlPoint1X = source.x + (midX - source.x) * 0.5;
            const controlPoint2X = target.x - (target.x - midX) * 0.5;

            return `M ${source.x + 2} ${source.y}
                C ${controlPoint1X + 2} ${source.y},
                  ${controlPoint2X + 2} ${target.y},
                  ${target.x + 2} ${target.y}`;
        })
        .attr('stroke', d => d.color)
        .attr('stroke-width', 6.5)
        .attr('fill', 'none')
        .style('cursor', 'pointer')
        .on('click', function (event, d) {
                const sourceNode = nodes.find(n => n.id === d.source);
                const targetNode = nodes.find(n => n.id === d.target);

                const relevantBranch = branches.find(branch => {

                const containsSource = branch.steps.some(step => step.id === sourceNode.id);
                const containsTarget = branch.steps.some(step => step.id === targetNode.id);
                return containsSource && containsTarget;
            });

            if (relevantBranch) {
                setGetTitle(`/map-career/${relevantBranch.branch_id}`);
            } else {
                const mainBranch = {
                    branch_id: branch.id,
                    steps: branch.steps
                };
                setGetTitle(`/map-career/${mainBranch.branch_id}`);
            }
        });


    svg.selectAll('line.node-line')
        .data(nodes.slice(1))
        .enter().append('line')
        .attr('class', 'node-line')
        .attr('x1', (d, i) => (d.x + 15))
        .attr('x2', (d, i) => (d.x + 15))
        .attr('y1', (d, i) => {
            const firstLineUp = nodes[1].y <= height / 2;

            if (i === 0) {
                return firstLineUp ? d.y - 7 : d.y + 7;
            }

            if (firstLineUp) {
                return i % 2 === 0 ? d.y - 7 : d.y + 7;
            } else {
                return i % 2 === 0 ? d.y + 7 : d.y - 7;
            }
        })
        .attr('y2', (d, i) => {
            const firstLineUp = nodes[1].y <= height / 2;

            if (i === 0) {
                return firstLineUp ? d.y : d.y;
            }

            if (firstLineUp) {
                return i % 2 === 0 ? d.y : d.y;
            } else {
                return i % 2 === 0 ? d.y : d.y;
            }
        })
        .attr('stroke', d => d.color)
        .attr('stroke-width', 3)
        .style('cursor', 'pointer')
        .on('mouseover', function (event, d) {
            tooltip.style('background', d.color);
            tooltip.style('font-size', '9px');
            tooltip.style('padding', '5px 8px');
            tooltip.html(`${d.title}`)
                .style('visibility', 'visible');
        })
        .on('mousemove', function (event) {
            tooltip
                .style('top', (event.pageY - tooltipHeight / 1.7) + 'px')
                .style('left', (event.pageX - tooltipWidth / 2) + 'px');
        })
        .on('mouseout', function () {
            tooltip.style('visibility', 'hidden');
        });

    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];

    [firstNode, lastNode].forEach(node => {
        svg.append('circle')
            .attr('r', 10)
            .attr('cx', node.x + 9)
            .attr('cy', node.y)
            .attr('fill', node.color)
            .style('cursor', 'pointer')
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 12);

                tooltip.style('background', node.color);
                tooltip.style('font-size', '9px');
                tooltip.style('padding', '5px 8px');
                tooltip.html(`${node.title}`)
                    .style('visibility', 'visible');
            })
            .on('mousemove', function (event) {
                tooltip
                    .style('top', (event.pageY - tooltipHeight / 1.7) + 'px')
                    .style('left', (event.pageX - tooltipWidth / 2) + 'px');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 8);

                tooltip.style('visibility', 'hidden');
            })

            .on('click', (e, d) => {
                setGetTitle(lastBranchNode.title);
                setGetDescription(lastBranchNode.description);
                setGettingSkillsData(lastBranchNode.skills);
            });
    });

    branches.forEach(branch => {
        const lastBranchNode = nodes.find(n => n.id === branch.steps[branch.steps.length - 1].id);

        svg.append('circle')
            .attr('r', 9.5)
            .attr('cx', lastBranchNode.x + 9.4)
            .attr('cy', lastBranchNode.y)
            .attr('fill', lastBranchNode.color)
            .style('cursor', 'pointer')
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 12);

                tooltip.style('background', lastBranchNode.color);
                tooltip.style('font-size', '9px');
                tooltip.style('padding', '5px 8px');
                tooltip.html(`${lastBranchNode.title}`)
                    .style('visibility', 'visible');
            })
            .on('mousemove', function (event) {
                tooltip
                    .style('top', (event.pageY - tooltipHeight / 1.7) + 'px')
                    .style('left', (event.pageX - tooltipWidth / 2) + 'px');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 8);

                tooltip.style('visibility', 'hidden');
            })
            .append('title')
            .text(lastBranchNode.title);
    });


    svg.selectAll('path.branch')
        .data(branches)
        .enter().append('path')
        .attr('class', 'branch')
        .attr('d', branch => {
            const points = branch.steps.map(step => nodes.find(n => n.id === step.id));
            const lineGenerator = d3.line()
                .x(d => d.x + 2)
                .y(d => d.y)
                .curve(d3.curveCatmullRom.alpha(0.6));

            const firstPoint = points[0];
            const controlPoints = [
                { x: firstPoint.x - 2, y: firstPoint.y },
                ...points,
                { x: points[points.length - 1].x + 0, y: points[points.length - 1].y }
            ];

            return lineGenerator(controlPoints);
        })
        .attr('stroke', d => d.color)
        .attr('stroke-width', 6.5)
        .attr('fill', 'none')
        .style('cursor', 'pointer')
        .on('click', function (event, d) {
            setGetTitle(`/map-career/${d.branch_id}`);
        });

    svg.selectAll('text')
        .data(nodes)
        .enter().append('g')
        .each(function (d) {
            const g = d3.select(this);

            const isFirstNode = d.id === nodes[0].id;
            const isLastNode = d.id === nodes[nodes.length - 1].id;
            const isBranchEndNode = branches.some(branch => branch.steps[branch.steps.length - 1].id === d.id);

            const fontSize = isFirstNode || isLastNode || isBranchEndNode ? '12px' : '10px';
            const Color = isFirstNode || isLastNode || isBranchEndNode ? '#354E70' : '#5B708B';
            const Bold = isFirstNode || isLastNode || isBranchEndNode ? 'bold' : 'medium';
            const lineValue = isFirstNode || isLastNode ? 0 : -10;
            const RightShift = isLastNode || isBranchEndNode ? 110 : 0;
            const LeftShift = isFirstNode ? -45 : 0;
            const splitText = !(isFirstNode || isLastNode || isBranchEndNode);
            const margin = 12;

            if (isFirstNode) {  

                const words = d.title.split(' ');
                let totalHeight = 0;
                let maxWidth = 0;
                const lineHeight = 20;
                const padding = 10;
                const leftShift = -65;
                
                const tempTexts = [];
                
                if (words.length > 2) {
                    const line1 = words.slice(0, 2).join(' ');
                    const line2 = words.slice(2).join(' ');
                    
                    [line1, line2].forEach((line, i) => {
                        const tempText = g.append('text')
                            .attr('x', d.x + leftShift)
                            .attr('y', d.y + (i * lineHeight) + 20)
                            .attr('text-anchor', 'middle')
                            .attr('fill', Color)
                            .style('font-weight', Bold)
                            .style('font-size', fontSize)
                            .text(line);
                        
                        const bbox = tempText.node().getBBox();
                        maxWidth = Math.max(maxWidth, bbox.width);
                        totalHeight += lineHeight;
                        tempTexts.push({ text: line, y: d.y + (i * lineHeight) + 20 });
                        tempText.remove();
                    });
                } else {
                    const tempText = g.append('text')
                        .attr('x', d.x + leftShift)
                        .attr('y', d.y + 20)
                        .attr('text-anchor', 'middle')
                        .attr('fill', Color)
                        .style('font-weight', Bold)
                        .style('font-size', fontSize)
                        .text(d.title);
                    
                    const bbox = tempText.node().getBBox();
                    maxWidth = bbox.width;
                    totalHeight = lineHeight;
                    tempTexts.push({ text: d.title, y: d.y + 20 });
                    tempText.remove();
                }
    
                g.append('rect')
                    .attr('x', (d.x + leftShift) - (maxWidth / 2) - padding)
                    .attr('y', d.y + 8)
                    .attr('width', maxWidth + (padding * 2))
                    .attr('height', totalHeight + padding)
                    .attr('fill', '#3749A626')
                    .attr('rx', 5)
                    .attr('ry', 5);
    
                tempTexts.forEach(({text, y}) => {
                    g.append('text')
                        .attr('x', d.x + leftShift)
                        .attr('y', y + 6)
                        .attr('text-anchor', 'middle')
                        .attr('fill', Color)
                        .style('font-weight', Bold)
                        .style('font-size', fontSize)
                        .text(text);
                });

            }
            else if (isLastNode || isBranchEndNode) {
            const textY = d.y - 10;
        
            const words = d.title.split(' ');
            if (words.length > 2) {
                wrapText(g, d.title, d.x + 110, textY + 18, fontSize, Color, Bold, true, null, lineValue, RightShift, LeftShift);
            } else {
                wrapText(g, d.title, d.x + margin, textY, fontSize, Color, Bold, false, null, lineValue, RightShift, LeftShift);
            }
            }
            else {
                const currentIndex = nodes.indexOf(d);
                const isUp = d.y <= height / 2;
                let textY;

                if (currentIndex % 2 === 0) {
                    if (d.title.split(' ').length > 3) {
                        textY = d.y - 22;
                    } else {
                        textY = d.y - 12;
                    }
                } else {
                    if (d.title.split(' ').length > 3) {
                        textY = d.y + 24;
                    } else {
                        textY = d.y + 30;
                    }
                };
                wrapText(g, 
                    d.title.split(' ').length > 3 
                        ? d.title.split(' ').slice(0, 3).join(' ') + "..." 
                        : d.title, 
                    d.x + margin, 
                    textY, 
                    fontSize, 
                    Color, 
                    Bold, 
                    splitText, 
                    null, 
                    lineValue, 
                    RightShift, 
                    LeftShift
                );            
            }
        });

};

export default DrawBranch;