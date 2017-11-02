export const Cypher = {
	get QL() {
		const query = [];
		return {
			PeriodicCommit(size = 1000) {
				query.push(` USING PERIODIC COMMIT ${size}`);
				return this;
			},
			get LoadCSV() {
				query.push(` LOAD CSV`);
				return this;
			},
			get WithHeaders() {
				query.push(` WITH HEADERS`);
				return this;
			},
			From(url) {
				query.push(` FROM ${url}`);
				return this;
			},
			get AsLine() {
				query.push(` AS line`);
				return this;
			},
			get Match() {
				query.push(` MATCH`);
				return this;
			},
			Node(name, label) {
				query.push({type: 'NODE', name, label, params: [], toString() {
					const name = this.name ? this.name : '';
					const label = this.label ? ':' + this.label : '';
					const params = this.params.map((p) => `${p.name}: ${p.value}`);
					if (params.length) {
						return `(${name}${label} {${params.join(', ')}})`;
					}
					return `(${name}${label})`;
				}});
				return this;
			},
			WithParam(name, value) {
				const obj = query[query.length - 1];
				if (!(obj && typeof obj === 'object')) {
					throw new TypeError('expect Node or Edge');
				}
				obj.params.push({name, value});
				return this;
			},
			UsingIndex(name) {
				const obj = query.slice().reverse().filter((obj, token) => obj && obj.name)[0];
				if (!(obj && typeof obj === 'object')) {
					throw new TypeError(`expect a Node clause before this clause, like "Node('foo', 'bar').UsingIndex('key')"`);
				}
				query.push(` USING INDEX ${obj.name}:${obj.label}(${name})`);
				return this;
			},
			get Merge() {
				query.push(` MERGE`);
				return this;
			},
			get Via() {
				query.push(`-`);
				return this;
			},
			Edge(name, label) {
				query.push({type: 'EDGE', name, label, params: [], toString() {
					const name = this.name ? this.name : '';
					const label = this.label ? ':' + this.label : '';
					const params = this.params.map((p) => `${p.name}: ${p.value}`);
					if (params.length) {
						return `[${name}${label} {${params.join(', ')}}]`;
					}
					return `[${name}${label}]`;
				}});
				return this;
			},
			get To() {
				const obj = query[query.length - 1];
				if (!(obj && typeof obj === 'object')) {
					throw new TypeError(`expect a Node or Edge like "Node('foo','Foo').To.Edge(...)"`)
				}
				if (obj.type === 'NODE') {
					query.push('<-');
				} else {
					query.push('->');
				}
				return this;
			},
			get On() {
				query.push(` ON`);
				return this;
			},
			get Create() {
				query.push(` CREATE`);
				return this;
			},
			SetFieldsFromLine(name, fields) {
				let q;
				if (query[query.length - 1] === ' MATCH') {
					q = fields.map((field) => `${field}: coalesce(line.${field}, ${name}.${field})`).join(', ');
				} else {
					q = fields.map((field) => `${field}: line.${field}`).join(', ');
				}
				query.push(` SET ${name} += {${q}}`);
				return this;
			},
			toString() {
				return query.join('').trim();
			}
		}
	}
};
