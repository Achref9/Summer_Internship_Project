import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useParams, Link } from 'react-router-dom';
import './BranchVisualization.css';
import logo from '../assets/Git-Icon-White.png';
import ApiService from '../config/ApiService'; // Import ApiService

const BranchVisualization = () => {
  const { owner, repo } = useParams();
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [newBranchName, setNewBranchName] = useState('');
  const d3Container = useRef(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await ApiService.getBranches(owner, repo);

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

  const handleRenameBranch = async () => {
    if (!selectedBranch || !newBranchName) {
      setError('Branch name cannot be empty');
      return;
    }

    try {
      const response = await ApiService.renameBranch(owner, repo, selectedBranch, newBranchName);

      if (response.status === 200) {
        const updatedBranches = branches.map(branch =>
          branch.name === selectedBranch ? { ...branch, name: newBranchName } : branch
        );
        setBranches(updatedBranches);
        setSelectedBranch(null);
        setNewBranchName('');
        setError('');
      } else {
        setError('Failed to rename branch');
      }
    } catch (err) {
      console.error('Error renaming branch:', err);
      setError('Failed to rename branch');
    }
  };

  useEffect(() => {
    if (branches.length > 0) {
      const svg = d3.select(d3Container.current);
      svg.selectAll('*').remove();

      const width = 1200;
      const height = 500;

      const root = d3.hierarchy({
        name: 'main',
        children: branches.filter(branch => branch.name !== 'main' && branch.name !== 'master').map(branch => ({ name: branch.name }))
      });

      const treeLayout = d3.tree().size([width, height - 200]);
      const treeData = treeLayout(root);

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

      svg.selectAll('circle')
        .data(treeData.descendants())
        .enter()
        .append('circle')
        .attr('r', 20)
        .attr('fill', d => (d.depth === 0 ? 'orange' : 'steelblue'))
        .attr('cx', d => d.x)
        .attr('cy', d => d.y + 100)
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5)
        .on('click', function(event, d) {
          if (d.data && d.data.name) {
            setSelectedBranch(d.data.name);
            setNewBranchName(d.data.name);
          } else {
            console.warn('Clicked node does not have a name');
          }
        });

      svg.selectAll('text')
        .data(treeData.descendants())
        .enter()
        .append('text')
        .text(d => d.data.name)
        .attr('font-size', 16)
        .attr('x', d => d.x)
        .attr('y', d => d.y + 75)
        .attr('text-anchor', 'middle')
        .attr('dy', '-1em')
        .attr('font-weight', 'bold');
    }
  }, [branches]);

  const Notice = () => (
    <div className="notice">
      <div className="notice-icon">!</div>
      <div className="notice-text">Click on a branch to rename it</div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 header">
        <h2>
          <img src={logo} alt="GitHub Logo" style={{ width: '40px', marginRight: '10px' }} />
          Branches of {owner}/{repo}
        </h2>
        <Link to="/repos" className="btn btn-primary">Back to Repos</Link>
      </div>
      <Notice />

      {error && <p className="text-danger">{error}</p>}
      <div className="svg-container">
        <svg ref={d3Container} width="1200" height="800"></svg>
      </div>
      {selectedBranch && (
        <div className="modal">
          <div className="modal-content">
            <h4>Rename Branch: {selectedBranch}</h4>
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="form-control"
            />
            <button onClick={handleRenameBranch} className="btn btn-primary mt-2">Rename</button>
            <button onClick={() => setSelectedBranch(null)} className="btn btn-secondary mt-2 ml-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchVisualization;
