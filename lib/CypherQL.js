'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Cypher = exports.Cypher = {
	get QL() {
		var query = [];
		return {
			PeriodicCommit: function PeriodicCommit() {
				var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

				query.push(' USING PERIODIC COMMIT ' + size);
				return this;
			},

			get LoadCSV() {
				query.push(' LOAD CSV');
				return this;
			},
			get WithHeaders() {
				query.push(' WITH HEADERS');
				return this;
			},
			From: function From(url) {
				query.push(' FROM ' + url);
				return this;
			},

			get AsLine() {
				query.push(' AS line');
				return this;
			},
			get Match() {
				query.push(' MATCH');
				return this;
			},
			Node: function Node(name, label) {
				query.push({ type: 'NODE', name: name, label: label, params: [], toString: function toString() {
						var name = this.name ? this.name : '';
						var label = this.label ? ':' + this.label : '';
						var params = this.params.map(function (p) {
							return p.name + ': ' + p.value;
						});
						if (params.length) {
							return '(' + name + label + ' {' + params.join(', ') + '})';
						}
						return '(' + name + label + ')';
					}
				});
				return this;
			},
			WithParam: function WithParam(name, value) {
				var obj = query[query.length - 1];
				if (!(obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object')) {
					throw new TypeError('expect Node or Edge');
				}
				obj.params.push({ name: name, value: value });
				return this;
			},
			UsingIndex: function UsingIndex(name) {
				var obj = query.slice().reverse().filter(function (obj, token) {
					return obj && obj.name;
				})[0];
				if (!(obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object')) {
					throw new TypeError('expect a Node clause before this clause, like "Node(\'foo\', \'bar\').UsingIndex(\'key\')"');
				}
				query.push(' USING INDEX ' + obj.name + ':' + obj.label + '(' + name + ')');
				return this;
			},

			get Merge() {
				query.push(' MERGE');
				return this;
			},
			get Via() {
				query.push('-');
				return this;
			},
			Edge: function Edge(name, label) {
				query.push({ type: 'EDGE', name: name, label: label, params: [], toString: function toString() {
						var name = this.name ? this.name : '';
						var label = this.label ? ':' + this.label : '';
						var params = this.params.map(function (p) {
							return p.name + ': ' + p.value;
						});
						if (params.length) {
							return '[' + name + label + ' {' + params.join(', ') + '}]';
						}
						return '[' + name + label + ']';
					}
				});
				return this;
			},

			get To() {
				var obj = query[query.length - 1];
				if (!(obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object')) {
					throw new TypeError('expect a Node or Edge like "Node(\'foo\',\'Foo\').To.Edge(...)"');
				}
				if (obj.type === 'NODE') {
					query.push('<-');
				} else {
					query.push('->');
				}
				return this;
			},
			get On() {
				query.push(' ON');
				return this;
			},
			get Create() {
				query.push(' CREATE');
				return this;
			},
			SetFieldsFromLine: function SetFieldsFromLine(name, fields) {
				var q = void 0;
				if (query[query.length - 1] === ' MATCH') {
					q = fields.map(function (field) {
						return field + ': coalesce(line.' + field + ', ' + name + '.' + field + ')';
					}).join(', ');
				} else {
					q = fields.map(function (field) {
						return field + ': line.' + field;
					}).join(', ');
				}
				query.push(' SET ' + name + ' += {' + q + '}');
				return this;
			},
			toString: function toString() {
				return query.join('').trim();
			}
		};
	}
};