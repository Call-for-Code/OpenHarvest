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
        define("@angular/compiler-cli/src/ngtsc/cycles/src/imports", ["require", "exports", "tslib", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportGraph = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    /**
     * A cached graph of imports in the `ts.Program`.
     *
     * The `ImportGraph` keeps track of dependencies (imports) of individual `ts.SourceFile`s. Only
     * dependencies within the same program are tracked; imports into packages on NPM are not.
     */
    var ImportGraph = /** @class */ (function () {
        function ImportGraph(checker) {
            this.checker = checker;
            this.map = new Map();
        }
        /**
         * List the direct (not transitive) imports of a given `ts.SourceFile`.
         *
         * This operation is cached.
         */
        ImportGraph.prototype.importsOf = function (sf) {
            if (!this.map.has(sf)) {
                this.map.set(sf, this.scanImports(sf));
            }
            return this.map.get(sf);
        };
        /**
         * Lists the transitive imports of a given `ts.SourceFile`.
         */
        ImportGraph.prototype.transitiveImportsOf = function (sf) {
            var imports = new Set();
            this.transitiveImportsOfHelper(sf, imports);
            return imports;
        };
        ImportGraph.prototype.transitiveImportsOfHelper = function (sf, results) {
            var _this = this;
            if (results.has(sf)) {
                return;
            }
            results.add(sf);
            this.importsOf(sf).forEach(function (imported) {
                _this.transitiveImportsOfHelper(imported, results);
            });
        };
        /**
         * Find an import path from the `start` SourceFile to the `end` SourceFile.
         *
         * This function implements a breadth first search that results in finding the
         * shortest path between the `start` and `end` points.
         *
         * @param start the starting point of the path.
         * @param end the ending point of the path.
         * @returns an array of source files that connect the `start` and `end` source files, or `null` if
         *     no path could be found.
         */
        ImportGraph.prototype.findPath = function (start, end) {
            var e_1, _a;
            if (start === end) {
                // Escape early for the case where `start` and `end` are the same.
                return [start];
            }
            var found = new Set([start]);
            var queue = [new Found(start, null)];
            while (queue.length > 0) {
                var current = queue.shift();
                var imports = this.importsOf(current.sourceFile);
                try {
                    for (var imports_1 = (e_1 = void 0, tslib_1.__values(imports)), imports_1_1 = imports_1.next(); !imports_1_1.done; imports_1_1 = imports_1.next()) {
                        var importedFile = imports_1_1.value;
                        if (!found.has(importedFile)) {
                            var next = new Found(importedFile, current);
                            if (next.sourceFile === end) {
                                // We have hit the target `end` path so we can stop here.
                                return next.toPath();
                            }
                            found.add(importedFile);
                            queue.push(next);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (imports_1_1 && !imports_1_1.done && (_a = imports_1.return)) _a.call(imports_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return null;
        };
        /**
         * Add a record of an import from `sf` to `imported`, that's not present in the original
         * `ts.Program` but will be remembered by the `ImportGraph`.
         */
        ImportGraph.prototype.addSyntheticImport = function (sf, imported) {
            if (isLocalFile(imported)) {
                this.importsOf(sf).add(imported);
            }
        };
        ImportGraph.prototype.scanImports = function (sf) {
            var e_2, _a;
            var imports = new Set();
            try {
                // Look through the source file for import and export statements.
                for (var _b = tslib_1.__values(sf.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var stmt = _c.value;
                    if ((!ts.isImportDeclaration(stmt) && !ts.isExportDeclaration(stmt)) ||
                        stmt.moduleSpecifier === undefined) {
                        continue;
                    }
                    var symbol = this.checker.getSymbolAtLocation(stmt.moduleSpecifier);
                    if (symbol === undefined || symbol.valueDeclaration === undefined) {
                        // No symbol could be found to skip over this import/export.
                        continue;
                    }
                    var moduleFile = symbol.valueDeclaration;
                    if (ts.isSourceFile(moduleFile) && isLocalFile(moduleFile)) {
                        // Record this local import.
                        imports.add(moduleFile);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return imports;
        };
        return ImportGraph;
    }());
    exports.ImportGraph = ImportGraph;
    function isLocalFile(sf) {
        return !sf.isDeclarationFile;
    }
    /**
     * A helper class to track which SourceFiles are being processed when searching for a path in
     * `getPath()` above.
     */
    var Found = /** @class */ (function () {
        function Found(sourceFile, parent) {
            this.sourceFile = sourceFile;
            this.parent = parent;
        }
        /**
         * Back track through this found SourceFile and its ancestors to generate an array of
         * SourceFiles that form am import path between two SourceFiles.
         */
        Found.prototype.toPath = function () {
            var array = [];
            var current = this;
            while (current !== null) {
                array.push(current.sourceFile);
                current = current.parent;
            }
            // Pushing and then reversing, O(n), rather than unshifting repeatedly, O(n^2), avoids
            // manipulating the array on every iteration: https://stackoverflow.com/a/26370620
            return array.reverse();
        };
        return Found;
    }());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvY3ljbGVzL3NyYy9pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFFakM7Ozs7O09BS0c7SUFDSDtRQUdFLHFCQUFvQixPQUF1QjtZQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtZQUZuQyxRQUFHLEdBQUcsSUFBSSxHQUFHLEVBQXFDLENBQUM7UUFFYixDQUFDO1FBRS9DOzs7O1dBSUc7UUFDSCwrQkFBUyxHQUFULFVBQVUsRUFBaUI7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1lBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUUsQ0FBQztRQUMzQixDQUFDO1FBRUQ7O1dBRUc7UUFDSCx5Q0FBbUIsR0FBbkIsVUFBb0IsRUFBaUI7WUFDbkMsSUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQWlCLENBQUM7WUFDekMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QyxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRU8sK0NBQXlCLEdBQWpDLFVBQWtDLEVBQWlCLEVBQUUsT0FBMkI7WUFBaEYsaUJBUUM7WUFQQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ25CLE9BQU87YUFDUjtZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENB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QzFELDRCQUE0Qjt3QkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDekI7aUJBQ0Y7Ozs7Ozs7OztZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDSCxrQkFBQztJQUFELENBQUMsQUExR0QsSUEwR0M7SUExR1ksa0NBQVc7SUE0R3hCLFNBQVMsV0FBVyxDQUFDLEVBQWlCO1FBQ3BDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNIO1FBQ0UsZUFBcUIsVUFBeUIsRUFBVyxNQUFrQjtZQUF0RCxlQUFVLEdBQVYsVUFBVSxDQUFlO1lBQVcsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUFHLENBQUM7UUFFL0U7OztXQUdHO1FBQ0gsc0JBQU0sR0FBTjtZQUNFLElBQU0sS0FBSyxHQUFvQixFQUFFLENBQUM7WUFDbEMsSUFBSSxPQUFPLEdBQWUsSUFBSSxDQUFDO1lBQy9CLE9BQU8sT0FBTyxLQUFLLElBQUksRUFBRTtnQkFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQzFCO1lBQ0Qsc0ZBQXNGO1lBQ3RGLGtGQUFrRjtZQUNsRixPQUFPLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBQ0gsWUFBQztJQUFELENBQUMsQUFsQkQsSUFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogQSBjYWNoZWQgZ3JhcGggb2YgaW1wb3J0cyBpbiB0aGUgYHRzLlByb2dyYW1gLlxuICpcbiAqIFRoZSBgSW1wb3J0R3JhcGhgIGtlZXBzIHRyYWNrIG9mIGRlcGVuZGVuY2llcyAoaW1wb3J0cykgb2YgaW5kaXZpZHVhbCBgdHMuU291cmNlRmlsZWBzLiBPbmx5XG4gKiBkZXBlbmRlbmNpZXMgd2l0aGluIHRoZSBzYW1lIHByb2dyYW0gYXJlIHRyYWNrZWQ7IGltcG9ydHMgaW50byBwYWNrYWdlcyBvbiBOUE0gYXJlIG5vdC5cbiAqL1xuZXhwb3J0IGNsYXNzIEltcG9ydEdyYXBoIHtcbiAgcHJpdmF0ZSBtYXAgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIFNldDx0cy5Tb3VyY2VGaWxlPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKSB7fVxuXG4gIC8qKlxuICAgKiBMaXN0IHRoZSBkaXJlY3QgKG5vdCB0cmFuc2l0aXZlKSBpbXBvcnRzIG9mIGEgZ2l2ZW4gYHRzLlNvdXJjZUZpbGVgLlxuICAgKlxuICAgKiBUaGlzIG9wZXJhdGlvbiBpcyBjYWNoZWQuXG4gICAqL1xuICBpbXBvcnRzT2Yoc2Y6IHRzLlNvdXJjZUZpbGUpOiBTZXQ8dHMuU291cmNlRmlsZT4ge1xuICAgIGlmICghdGhpcy5tYXAuaGFzKHNmKSkge1xuICAgICAgdGhpcy5tYXAuc2V0KHNmLCB0aGlzLnNjYW5JbXBvcnRzKHNmKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm1hcC5nZXQoc2YpITtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0cyB0aGUgdHJhbnNpdGl2ZSBpbXBvcnRzIG9mIGEgZ2l2ZW4gYHRzLlNvdXJjZUZpbGVgLlxuICAgKi9cbiAgdHJhbnNpdGl2ZUltcG9ydHNPZihzZjogdHMuU291cmNlRmlsZSk6IFNldDx0cy5Tb3VyY2VGaWxlPiB7XG4gICAgY29uc3QgaW1wb3J0cyA9IG5ldyBTZXQ8dHMuU291cmNlRmlsZT4oKTtcbiAgICB0aGlzLnRyYW5zaXRpdmVJbXBvcnRzT2ZIZWxwZXIoc2YsIGltcG9ydHMpO1xuICAgIHJldHVybiBpbXBvcnRzO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2l0aXZlSW1wb3J0c09mSGVscGVyKHNmOiB0cy5Tb3VyY2VGaWxlLCByZXN1bHRzOiBTZXQ8dHMuU291cmNlRmlsZT4pOiB2b2lkIHtcbiAgICBpZiAocmVzdWx0cy5oYXMoc2YpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc3VsdHMuYWRkKHNmKTtcbiAgICB0aGlzLmltcG9ydHNPZihzZikuZm9yRWFjaChpbXBvcnRlZCA9PiB7XG4gICAgICB0aGlzLnRyYW5zaXRpdmVJbXBvcnRzT2ZIZWxwZXIoaW1wb3J0ZWQsIHJlc3VsdHMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgYW4gaW1wb3J0IHBhdGggZnJvbSB0aGUgYHN0YXJ0YCBTb3VyY2VGaWxlIHRvIHRoZSBgZW5kYCBTb3VyY2VGaWxlLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGltcGxlbWVudHMgYSBicmVhZHRoIGZpcnN0IHNlYXJjaCB0aGF0IHJlc3VsdHMgaW4gZmluZGluZyB0aGVcbiAgICogc2hvcnRlc3QgcGF0aCBiZXR3ZWVuIHRoZSBgc3RhcnRgIGFuZCBgZW5kYCBwb2ludHMuXG4gICAqXG4gICAqIEBwYXJhbSBzdGFydCB0aGUgc3RhcnRpbmcgcG9pbnQgb2YgdGhlIHBhdGguXG4gICAqIEBwYXJhbSBlbmQgdGhlIGVuZGluZyBwb2ludCBvZiB0aGUgcGF0aC5cbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2Ygc291cmNlIGZpbGVzIHRoYXQgY29ubmVjdCB0aGUgYHN0YXJ0YCBhbmQgYGVuZGAgc291cmNlIGZpbGVzLCBvciBgbnVsbGAgaWZcbiAgICogICAgIG5vIHBhdGggY291bGQgYmUgZm91bmQuXG4gICAqL1xuICBmaW5kUGF0aChzdGFydDogdHMuU291cmNlRmlsZSwgZW5kOiB0cy5Tb3VyY2VGaWxlKTogdHMuU291cmNlRmlsZVtdfG51bGwge1xuICAgIGlmIChzdGFydCA9PT0gZW5kKSB7XG4gICAgICAvLyBFc2NhcGUgZWFybHkgZm9yIHRoZSBjYXNlIHdoZXJlIGBzdGFydGAgYW5kIGBlbmRgIGFyZSB0aGUgc2FtZS5cbiAgICAgIHJldHVybiBbc3RhcnRdO1xuICAgIH1cblxuICAgIGNvbnN0IGZvdW5kID0gbmV3IFNldDx0cy5Tb3VyY2VGaWxlPihbc3RhcnRdKTtcbiAgICBjb25zdCBxdWV1ZTogRm91bmRbXSA9IFtuZXcgRm91bmQoc3RhcnQsIG51bGwpXTtcblxuICAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gcXVldWUuc2hpZnQoKSE7XG4gICAgICBjb25zdCBpbXBvcnRzID0gdGhpcy5pbXBvcnRzT2YoY3VycmVudC5zb3VyY2VGaWxlKTtcbiAgICAgIGZvciAoY29uc3QgaW1wb3J0ZWRGaWxlIG9mIGltcG9ydHMpIHtcbiAgICAgICAgaWYgKCFmb3VuZC5oYXMoaW1wb3J0ZWRGaWxlKSkge1xuICAgICAgICAgIGNvbnN0IG5leHQgPSBuZXcgRm91bmQoaW1wb3J0ZWRGaWxlLCBjdXJyZW50KTtcbiAgICAgICAgICBpZiAobmV4dC5zb3VyY2VGaWxlID09PSBlbmQpIHtcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgaGl0IHRoZSB0YXJnZXQgYGVuZGAgcGF0aCBzbyB3ZSBjYW4gc3RvcCBoZXJlLlxuICAgICAgICAgICAgcmV0dXJuIG5leHQudG9QYXRoKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvdW5kLmFkZChpbXBvcnRlZEZpbGUpO1xuICAgICAgICAgIHF1ZXVlLnB1c2gobmV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVjb3JkIG9mIGFuIGltcG9ydCBmcm9tIGBzZmAgdG8gYGltcG9ydGVkYCwgdGhhdCdzIG5vdCBwcmVzZW50IGluIHRoZSBvcmlnaW5hbFxuICAgKiBgdHMuUHJvZ3JhbWAgYnV0IHdpbGwgYmUgcmVtZW1iZXJlZCBieSB0aGUgYEltcG9ydEdyYXBoYC5cbiAgICovXG4gIGFkZFN5bnRoZXRpY0ltcG9ydChzZjogdHMuU291cmNlRmlsZSwgaW1wb3J0ZWQ6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBpZiAoaXNMb2NhbEZpbGUoaW1wb3J0ZWQpKSB7XG4gICAgICB0aGlzLmltcG9ydHNPZihzZikuYWRkKGltcG9ydGVkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNjYW5JbXBvcnRzKHNmOiB0cy5Tb3VyY2VGaWxlKTogU2V0PHRzLlNvdXJjZUZpbGU+IHtcbiAgICBjb25zdCBpbXBvcnRzID0gbmV3IFNldDx0cy5Tb3VyY2VGaWxlPigpO1xuICAgIC8vIExvb2sgdGhyb3VnaCB0aGUgc291cmNlIGZpbGUgZm9yIGltcG9ydCBhbmQgZXhwb3J0IHN0YXRlbWVudHMuXG4gICAgZm9yIChjb25zdCBzdG10IG9mIHNmLnN0YXRlbWVudHMpIHtcbiAgICAgIGlmICgoIXRzLmlzSW1wb3J0RGVjbGFyYXRpb24oc3RtdCkgJiYgIXRzLmlzRXhwb3J0RGVjbGFyYXRpb24oc3RtdCkpIHx8XG4gICAgICAgICAgc3RtdC5tb2R1bGVTcGVjaWZpZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3ltYm9sID0gdGhpcy5jaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24oc3RtdC5tb2R1bGVTcGVjaWZpZXIpO1xuICAgICAgaWYgKHN5bWJvbCA9PT0gdW5kZWZpbmVkIHx8IHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gc3ltYm9sIGNvdWxkIGJlIGZvdW5kIHRvIHNraXAgb3ZlciB0aGlzIGltcG9ydC9leHBvcnQuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgbW9kdWxlRmlsZSA9IHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uO1xuICAgICAgaWYgKHRzLmlzU291cmNlRmlsZShtb2R1bGVGaWxlKSAmJiBpc0xvY2FsRmlsZShtb2R1bGVGaWxlKSkge1xuICAgICAgICAvLyBSZWNvcmQgdGhpcyBsb2NhbCBpbXBvcnQuXG4gICAgICAgIGltcG9ydHMuYWRkKG1vZHVsZUZpbGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW1wb3J0cztcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0xvY2FsRmlsZShzZjogdHMuU291cmNlRmlsZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gIXNmLmlzRGVjbGFyYXRpb25GaWxlO1xufVxuXG4vKipcbiAqIEEgaGVscGVyIGNsYXNzIHRvIHRyYWNrIHdoaWNoIFNvdXJjZUZpbGVzIGFyZSBiZWluZyBwcm9jZXNzZWQgd2hlbiBzZWFyY2hpbmcgZm9yIGEgcGF0aCBpblxuICogYGdldFBhdGgoKWAgYWJvdmUuXG4gKi9cbmNsYXNzIEZvdW5kIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgcmVhZG9ubHkgcGFyZW50OiBGb3VuZHxudWxsKSB7fVxuXG4gIC8qKlxuICAgKiBCYWNrIHRyYWNrIHRocm91Z2ggdGhpcyBmb3VuZCBTb3VyY2VGaWxlIGFuZCBpdHMgYW5jZXN0b3JzIHRvIGdlbmVyYXRlIGFuIGFycmF5IG9mXG4gICAqIFNvdXJjZUZpbGVzIHRoYXQgZm9ybSBhbSBpbXBvcnQgcGF0aCBiZXR3ZWVuIHR3byBTb3VyY2VGaWxlcy5cbiAgICovXG4gIHRvUGF0aCgpOiB0cy5Tb3VyY2VGaWxlW10ge1xuICAgIGNvbnN0IGFycmF5OiB0cy5Tb3VyY2VGaWxlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudDogRm91bmR8bnVsbCA9IHRoaXM7XG4gICAgd2hpbGUgKGN1cnJlbnQgIT09IG51bGwpIHtcbiAgICAgIGFycmF5LnB1c2goY3VycmVudC5zb3VyY2VGaWxlKTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICB9XG4gICAgLy8gUHVzaGluZyBhbmQgdGhlbiByZXZlcnNpbmcsIE8obiksIHJhdGhlciB0aGFuIHVuc2hpZnRpbmcgcmVwZWF0ZWRseSwgTyhuXjIpLCBhdm9pZHNcbiAgICAvLyBtYW5pcHVsYXRpbmcgdGhlIGFycmF5IG9uIGV2ZXJ5IGl0ZXJhdGlvbjogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2MzcwNjIwXG4gICAgcmV0dXJuIGFycmF5LnJldmVyc2UoKTtcbiAgfVxufVxuIl19