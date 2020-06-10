import Vue from "vue";

declare namespace PkMarkdown {
    function install(vue: typeof Vue): void;
    function initEditor(isChangeMode?: boolean, currentValue?: string): void;
    function destroyEditor(): void;
    function setValue(value:string): void;
    function getValue(): string;
    function setHtml(value:string): void;
    function getHtml(): string;
    function exec(cmd:string): void;
}

export default PkMarkdown;
