'use strict';

const mongoose = require('mongoose');
const Agent = mongoose.model('Agents');

exports.list_all_agents = function (req, res) {
    Agent.find({}, function (err, agent) {
        if (err)
            res.send(err);
        res.json(agent);
    });
};

exports.create_an_agent = function (req, res) {
    var new_agent = new Agent(req.body);
    new_agent.save(function (err, agent) {
        if (err)
            res.send(err);
        res.json(agent);
    });
};

exports.read_an_agent = function (req, res) {
    Agent.findById(req.params.agentId, function (err, agent) {
        if (err)
            res.send(err);
        res.json(agent);
    });
};

exports.update_an_agent = function (req, res) {
    Agent.findOneAndUpdate({ _id: req.params.agentId }, req.body, { new: true }, function (err, agent) {
        if (err)
            res.send(err);
        res.json(agent);
    });
};

exports.delete_an_agent = function (req, res) {

    Agent.remove({
        _id: req.params.agentId
    }, function (err, agent) {
        if (err)
            res.send(err);
        res.json({ message: 'Agent successfully deleted' });
    });
};
