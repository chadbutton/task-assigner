'use strict';

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

var PrioritySchema = new Schema({
    value: {
        type: String,
        enum: ['low', 'high']
      }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Priority', PrioritySchema);