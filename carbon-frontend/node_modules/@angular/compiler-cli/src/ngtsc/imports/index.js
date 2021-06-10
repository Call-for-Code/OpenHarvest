/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/imports", ["require", "exports", "@angular/compiler-cli/src/ngtsc/imports/src/alias", "@angular/compiler-cli/src/ngtsc/imports/src/core", "@angular/compiler-cli/src/ngtsc/imports/src/default", "@angular/compiler-cli/src/ngtsc/imports/src/emitter", "@angular/compiler-cli/src/ngtsc/imports/src/references", "@angular/compiler-cli/src/ngtsc/imports/src/resolver"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModuleResolver = exports.Reference = exports.UnifiedModulesStrategy = exports.RelativePathStrategy = exports.ReferenceEmitter = exports.LogicalProjectStrategy = exports.LocalIdentifierStrategy = exports.ImportFlags = exports.AbsoluteModuleStrategy = exports.NOOP_DEFAULT_IMPORT_RECORDER = exports.DefaultImportTracker = exports.validateAndRewriteCoreSymbol = exports.R3SymbolsImportRewriter = exports.NoopImportRewriter = exports.UnifiedModulesAliasingHost = exports.PrivateExportAliasingHost = exports.AliasStrategy = void 0;
    var alias_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/alias");
    Object.defineProperty(exports, "AliasStrategy", { enumerable: true, get: function () { return alias_1.AliasStrategy; } });
    Object.defineProperty(exports, "PrivateExportAliasingHost", { enumerable: true, get: function () { return alias_1.PrivateExportAliasingHost; } });
    Object.defineProperty(exports, "UnifiedModulesAliasingHost", { enumerable: true, get: function () { return alias_1.UnifiedModulesAliasingHost; } });
    var core_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/core");
    Object.defineProperty(exports, "NoopImportRewriter", { enumerable: true, get: function () { return core_1.NoopImportRewriter; } });
    Object.defineProperty(exports, "R3SymbolsImportRewriter", { enumerable: true, get: function () { return core_1.R3SymbolsImportRewriter; } });
    Object.defineProperty(exports, "validateAndRewriteCoreSymbol", { enumerable: true, get: function () { return core_1.validateAndRewriteCoreSymbol; } });
    var default_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/default");
    Object.defineProperty(exports, "DefaultImportTracker", { enumerable: true, get: function () { return default_1.DefaultImportTracker; } });
    Object.defineProperty(exports, "NOOP_DEFAULT_IMPORT_RECORDER", { enumerable: true, get: function () { return default_1.NOOP_DEFAULT_IMPORT_RECORDER; } });
    var emitter_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/emitter");
    Object.defineProperty(exports, "AbsoluteModuleStrategy", { enumerable: true, get: function () { return emitter_1.AbsoluteModuleStrategy; } });
    Object.defineProperty(exports, "ImportFlags", { enumerable: true, get: function () { return emitter_1.ImportFlags; } });
    Object.defineProperty(exports, "LocalIdentifierStrategy", { enumerable: true, get: function () { return emitter_1.LocalIdentifierStrategy; } });
    Object.defineProperty(exports, "LogicalProjectStrategy", { enumerable: true, get: function () { return emitter_1.LogicalProjectStrategy; } });
    Object.defineProperty(exports, "ReferenceEmitter", { enumerable: true, get: function () { return emitter_1.ReferenceEmitter; } });
    Object.defineProperty(exports, "RelativePathStrategy", { enumerable: true, get: function () { return emitter_1.RelativePathStrategy; } });
    Object.defineProperty(exports, "UnifiedModulesStrategy", { enumerable: true, get: function () { return emitter_1.UnifiedModulesStrategy; } });
    var references_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/references");
    Object.defineProperty(exports, "Reference", { enumerable: true, get: function () { return references_1.Reference; } });
    var resolver_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/resolver");
    Object.defineProperty(exports, "ModuleResolver", { enumerable: true, get: function () { return resolver_1.ModuleResolver; } });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2ltcG9ydHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsMkVBQStHO0lBQXpGLHNHQUFBLGFBQWEsT0FBQTtJQUFFLGtIQUFBLHlCQUF5QixPQUFBO0lBQUUsbUhBQUEsMEJBQTBCLE9BQUE7SUFDMUYseUVBQXFIO0lBQTdGLDBHQUFBLGtCQUFrQixPQUFBO0lBQUUsK0dBQUEsdUJBQXVCLE9BQUE7SUFBRSxvSEFBQSw0QkFBNEIsT0FBQTtJQUNqRywrRUFBd0c7SUFBekUsK0dBQUEsb0JBQW9CLE9BQUE7SUFBRSx1SEFBQSw0QkFBNEIsT0FBQTtJQUNqRiwrRUFBME87SUFBbE8saUhBQUEsc0JBQXNCLE9BQUE7SUFBa0Msc0dBQUEsV0FBVyxPQUFBO0lBQUUsa0hBQUEsdUJBQXVCLE9BQUE7SUFBRSxpSEFBQSxzQkFBc0IsT0FBQTtJQUF5QiwyR0FBQSxnQkFBZ0IsT0FBQTtJQUFFLCtHQUFBLG9CQUFvQixPQUFBO0lBQUUsaUhBQUEsc0JBQXNCLE9BQUE7SUFFbk4scUZBQXlEO0lBQW5DLHVHQUFBLFNBQVMsT0FBQTtJQUMvQixpRkFBOEM7SUFBdEMsMEdBQUEsY0FBYyxPQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCB7QWxpYXNpbmdIb3N0LCBBbGlhc1N0cmF0ZWd5LCBQcml2YXRlRXhwb3J0QWxpYXNpbmdIb3N0LCBVbmlmaWVkTW9kdWxlc0FsaWFzaW5nSG9zdH0gZnJvbSAnLi9zcmMvYWxpYXMnO1xuZXhwb3J0IHtJbXBvcnRSZXdyaXRlciwgTm9vcEltcG9ydFJld3JpdGVyLCBSM1N5bWJvbHNJbXBvcnRSZXdyaXRlciwgdmFsaWRhdGVBbmRSZXdyaXRlQ29yZVN5bWJvbH0gZnJvbSAnLi9zcmMvY29yZSc7XG5leHBvcnQge0RlZmF1bHRJbXBvcnRSZWNvcmRlciwgRGVmYXVsdEltcG9ydFRyYWNrZXIsIE5PT1BfREVGQVVMVF9JTVBPUlRfUkVDT1JERVJ9IGZyb20gJy4vc3JjL2RlZmF1bHQnO1xuZXhwb3J0IHtBYnNvbHV0ZU1vZHVsZVN0cmF0ZWd5LCBFbWl0dGVkUmVmZXJlbmNlLCBJbXBvcnRlZEZpbGUsIEltcG9ydEZsYWdzLCBMb2NhbElkZW50aWZpZXJTdHJhdGVneSwgTG9naWNhbFByb2plY3RTdHJhdGVneSwgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5LCBSZWZlcmVuY2VFbWl0dGVyLCBSZWxhdGl2ZVBhdGhTdHJhdGVneSwgVW5pZmllZE1vZHVsZXNTdHJhdGVneX0gZnJvbSAnLi9zcmMvZW1pdHRlcic7XG5leHBvcnQge1JlZXhwb3J0fSBmcm9tICcuL3NyYy9yZWV4cG9ydCc7XG5leHBvcnQge093bmluZ01vZHVsZSwgUmVmZXJlbmNlfSBmcm9tICcuL3NyYy9yZWZlcmVuY2VzJztcbmV4cG9ydCB7TW9kdWxlUmVzb2x2ZXJ9IGZyb20gJy4vc3JjL3Jlc29sdmVyJztcbiJdfQ==