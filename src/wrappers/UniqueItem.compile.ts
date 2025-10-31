import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/unique_item.tact',
    options: {
        debug: true,
    },
};
