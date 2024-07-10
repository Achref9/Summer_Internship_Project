import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { useParams, Link } from 'react-router-dom';

const BranchVisualization = () => {
  const { owner, repo } = useParams();
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const d3Container = useRef(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/branches/${owner}/${repo}`, { withCredentials: true });

        if (response.status === 200) {
          setBranches(response.data);
          setError('');
        } else {
          setError('Failed to fetch branches');
          setBranches([]);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to fetch branches');
        setBranches([]);
      }
    };

    fetchBranches();
  }, [owner, repo]);

  useEffect(() => {
    if (branches.length > 0) {
      const svg = d3.select(d3Container.current);
      svg.selectAll('*').remove();

      const width = 800;
      const height = 400;
      const mainBranch = branches.find(branch => branch.name === 'main' || branch.name === 'master');

      // Calculate positions
      const mainX = width / 2;
      const mainY = height / 2;
      const branchY = mainY + 100; // Vertical spacing for other branches

      const mainBranchNode = { id: mainBranch.name, x: mainX, y: mainY };
      const otherBranches = branches.filter(branch => branch.name !== 'main' && branch.name !== 'master');
      const branchNodes = otherBranches.map((branch, index) => ({
        id: branch.name,
        x: mainX + (index - Math.floor(otherBranches.length / 2)) * 100,
        y: branchY
      }));

      const allNodes = [mainBranchNode, ...branchNodes];
      const links = branchNodes.map(branch => ({ source: mainBranchNode, target: branch }));

      const simulation = d3.forceSimulation(allNodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const link = svg.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

      const node = svg.selectAll('circle')
        .data(allNodes)
        .enter()
        .append('circle')
        .attr('r', d => d.id === mainBranchNode.id ? 15 : 8)
        .attr('fill', d => d.id === mainBranchNode.id ? 'orange' : 'steelblue')
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5);

      const label = svg.selectAll('text')
        .data(allNodes)
        .enter()
        .append('text')
        .text(d => capitalizeFirstLetter(d.id)) // Capitalize first letter
        .attr('font-size', 12)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('font-weight', d => d.id === mainBranchNode.id ? 'bold' : 'normal')
        .attr('pointer-events', 'none'); // Ensure labels do not interfere with mouse events

      simulation.on('tick', () => {
        link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node.attr('cx', d => d.x)
          .attr('cy', d => d.y);

        label.attr('x', d => d.x)
          .attr('y', d => d.y - (d.id === mainBranchNode.id ? 20 : 12)); // Adjust label position based on circle radius
      });
    }
  }, [branches]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1); // Function to capitalize first letter
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Branches of {owner}/{repo}</h2>
        <Link to="/repos" className="btn btn-primary">Back to Repos</Link>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <svg ref={d3Container} width="800" height="400"></svg>
    </div>
  );
};

export default BranchVisualization;
