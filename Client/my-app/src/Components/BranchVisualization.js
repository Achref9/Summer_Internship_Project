import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { useParams, Link } from 'react-router-dom';
import './BranchVisualization.css'; // Import the CSS file
import logo from '../assets/Git-Icon-White.png'; // Adjust the path as necessary


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

      const width = 1200;
      const height = 500;

      // Convert branches to hierarchical data
      const root = d3.hierarchy({
        name: 'main',
        children: branches.filter(branch => branch.name !== 'main' && branch.name !== 'master').map(branch => ({ name: branch.name }))
      });

      // Create a tree layout
      const treeLayout = d3.tree().size([width, height - 200]);
      const treeData = treeLayout(root);

      // Draw links
      svg.selectAll('line')
        .data(treeData.links())
        .enter()
        .append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y + 100)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y + 100);

      // Draw nodes
      svg.selectAll('circle')
        .data(treeData.descendants())
        .enter()
        .append('circle')
        .attr('r', 20)
        .attr('fill', d => (d.depth === 0 ? 'orange' : 'steelblue'))
        .attr('cx', d => d.x)
        .attr('cy', d => d.y + 100)
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5);

      // Draw labels
      svg.selectAll('text')
        .data(treeData.descendants())
        .enter()
        .append('text')
        .text(d => d.data.name)
        .attr('font-size', 16)
        .attr('x', d => d.x)
        .attr('y', d => d.y + 75) // Adjust this value to move the labels up
        .attr('text-anchor', 'middle')
        .attr('dy', '-1em') // Adjust this value to move the labels up
        .attr('font-weight', 'bold');
    }
  }, [branches]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 header">
      <h2>
  <img src={logo} alt="GitHub Logo" style={{ width: '40px', marginRight: '10px' }} />
  Branches of {owner}/{repo}
</h2>
        <Link to="/repos" className="btn btn-primary">Back to Repos</Link>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div className="svg-container">
        <svg ref={d3Container} width="1200" height="800"></svg>
      </div>
    </div>
  );
};

export default BranchVisualization;
