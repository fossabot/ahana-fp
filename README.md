# Ahana FP

This package contains a series of "FP-friendly" classes for use in your code.

## What is "FP-friendly"?

An “FP-friendly’ object can be defined as an instance of the class with immutable internal property and a set of methods that are all ‘pure’ with the caveat that they are able to read internal fields without treating that as a side effect?

Put another way, in a purely FP language, the set of functions F that can operate on a type `T` can be reasonably modeled in a hybrid or OO language as a class `T`, where each of the functions in F becomes a method on the class `T`, with the initial parameter of each function being replaced by an internal property of `T`.

## Says who?

Well, me. I don't think this definition should cause anyone by the most hardened purist any real concern.

Implementing these in a purely FP style would still result in the functions being packaged someway, probably in some kind of namespace. This is just another way to manage this.
