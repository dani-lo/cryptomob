export type Constructor<T> = new (...args: any[]) => T;

// class MixinBuilder<T> {

//     superclass: T

//     constructor(superclass: T) {

//         this.superclass = superclass;

//     }    
//     with(mixins: Extendor[]) {
//         return mixins.reduce((c, mixin) => mixin(c), this.superclass);
//     }
// }// this will combine everything in one class

// const socials = {
//     foo () {
//         return 12
//     }
// }

// const SocialNetwork = <T>(superclass: Constructor<T>) => class extends superclass {
    
// }

// type Extendor = <T, I>(superclass: T) => T & I

// export const mix = <T>(superclass: T) => new MixinBuilder(superclass);

