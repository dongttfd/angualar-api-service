export class ParamsBuilder {
    private paramsAndValues: string[];

    constructor(params: object) {
        Object.keys(params).map(
            k => this.paramsAndValues.push([k, params[k]].join('='))
        );
    }

    toString = (): string => this.paramsAndValues.join('&');
}
