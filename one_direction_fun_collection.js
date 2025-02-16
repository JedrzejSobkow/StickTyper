export class OneDirectionFunCollection {
    constructor(one_arg_fun, delta_x, start_x = 0) {
        this.one_arg_fun = one_arg_fun;
        this.actual = start_x;
        this.delta_x = delta_x;
    }

    getNext() {
        this.actual += this.delta_x;
        return this.one_arg_fun(this.actual);
    }
}