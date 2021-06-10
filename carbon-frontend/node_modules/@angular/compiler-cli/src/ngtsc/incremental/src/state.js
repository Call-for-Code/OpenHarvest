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
        define("@angular/compiler-cli/src/ngtsc/incremental/src/state", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/incremental/semantic_graph", "@angular/compiler-cli/src/ngtsc/incremental/src/dependency_tracking"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IncrementalDriver = void 0;
    var tslib_1 = require("tslib");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var semantic_graph_1 = require("@angular/compiler-cli/src/ngtsc/incremental/semantic_graph");
    var dependency_tracking_1 = require("@angular/compiler-cli/src/ngtsc/incremental/src/dependency_tracking");
    /**
     * Drives an incremental build, by tracking changes and determining which files need to be emitted.
     */
    var IncrementalDriver = /** @class */ (function () {
        function IncrementalDriver(state, depGraph, logicalChanges) {
            this.depGraph = depGraph;
            this.logicalChanges = logicalChanges;
            this.state = state;
        }
        /**
         * Construct an `IncrementalDriver` with a starting state that incorporates the results of a
         * previous build.
         *
         * The previous build's `BuildState` is reconciled with the new program's changes, and the results
         * are merged into the new build's `PendingBuildState`.
         */
        IncrementalDriver.reconcile = function (oldProgram, oldDriver, newProgram, modifiedResourceFiles) {
            var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e;
            // Initialize the state of the current build based on the previous one.
            var state;
            if (oldDriver.state.kind === BuildStateKind.Pending) {
                // The previous build never made it past the pending state. Reuse it as the starting state for
                // this build.
                state = oldDriver.state;
            }
            else {
                var priorGraph = null;
                if (oldDriver.state.lastGood !== null) {
                    priorGraph = oldDriver.state.lastGood.semanticDepGraph;
                }
                // The previous build was successfully analyzed. `pendingEmit` is the only state carried
                // forward into this build.
                state = {
                    kind: BuildStateKind.Pending,
                    pendingEmit: oldDriver.state.pendingEmit,
                    pendingTypeCheckEmit: oldDriver.state.pendingTypeCheckEmit,
                    changedResourcePaths: new Set(),
                    changedTsPaths: new Set(),
                    lastGood: oldDriver.state.lastGood,
                    semanticDepGraphUpdater: new semantic_graph_1.SemanticDepGraphUpdater(priorGraph),
                };
            }
            // Merge the freshly modified resource files with any prior ones.
            if (modifiedResourceFiles !== null) {
                try {
                    for (var modifiedResourceFiles_1 = tslib_1.__values(modifiedResourceFiles), modifiedResourceFiles_1_1 = modifiedResourceFiles_1.next(); !modifiedResourceFiles_1_1.done; modifiedResourceFiles_1_1 = modifiedResourceFiles_1.next()) {
                        var resFile = modifiedResourceFiles_1_1.value;
                        state.changedResourcePaths.add(file_system_1.absoluteFrom(resFile));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (modifiedResourceFiles_1_1 && !modifiedResourceFiles_1_1.done && (_a = modifiedResourceFiles_1.return)) _a.call(modifiedResourceFiles_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            // Next, process the files in the new program, with a couple of goals:
            // 1) Determine which TS files have changed, if any, and merge them into `changedTsFiles`.
            // 2) Produce a list of TS files which no longer exist in the program (they've been deleted
            //    since the previous compilation). These need to be removed from the state tracking to avoid
            //    leaking memory.
            // All files in the old program, for easy detection of changes.
            var oldFiles = new Set(oldProgram.getSourceFiles());
            // Assume all the old files were deleted to begin with. Only TS files are tracked.
            var deletedTsPaths = new Set(tsOnlyFiles(oldProgram).map(function (sf) { return sf.fileName; }));
            try {
                for (var _f = tslib_1.__values(newProgram.getSourceFiles()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var newFile = _g.value;
                    if (!newFile.isDeclarationFile) {
                        // This file exists in the new program, so remove it from `deletedTsPaths`.
                        deletedTsPaths.delete(newFile.fileName);
                    }
                    if (oldFiles.has(newFile)) {
                        // This file hasn't changed; no need to look at it further.
                        continue;
                    }
                    // The file has changed since the last successful build. The appropriate reaction depends on
                    // what kind of file it is.
                    if (!newFile.isDeclarationFile) {
                        // It's a .ts file, so track it as a change.
                        state.changedTsPaths.add(newFile.fileName);
                    }
                    else {
                        // It's a .d.ts file. Currently the compiler does not do a great job of tracking
                        // dependencies on .d.ts files, so bail out of incremental builds here and do a full build.
                        // This usually only happens if something in node_modules changes.
                        return IncrementalDriver.fresh(newProgram);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                // The next step is to remove any deleted files from the state.
                for (var deletedTsPaths_1 = tslib_1.__values(deletedTsPaths), deletedTsPaths_1_1 = deletedTsPaths_1.next(); !deletedTsPaths_1_1.done; deletedTsPaths_1_1 = deletedTsPaths_1.next()) {
                    var filePath = deletedTsPaths_1_1.value;
                    state.pendingEmit.delete(filePath);
                    state.pendingTypeCheckEmit.delete(filePath);
                    // Even if the file doesn't exist in the current compilation, it still might have been changed
                    // in a previous one, so delete it from the set of changed TS files, just in case.
                    state.changedTsPaths.delete(filePath);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (deletedTsPaths_1_1 && !deletedTsPaths_1_1.done && (_c = deletedTsPaths_1.return)) _c.call(deletedTsPaths_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            // Now, changedTsPaths contains physically changed TS paths. Use the previous program's logical
            // dependency graph to determine logically changed files.
            var depGraph = new dependency_tracking_1.FileDependencyGraph();
            // If a previous compilation exists, use its dependency graph to determine the set of logically
            // changed files.
            var logicalChanges = null;
            if (state.lastGood !== null) {
                // Extract the set of logically changed files. At the same time, this operation populates the
                // current (fresh) dependency graph with information about those files which have not
                // logically changed.
                logicalChanges = depGraph.updateWithPhysicalChanges(state.lastGood.depGraph, state.changedTsPaths, deletedTsPaths, state.changedResourcePaths);
                try {
                    for (var _h = tslib_1.__values(state.changedTsPaths), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var fileName = _j.value;
                        logicalChanges.add(fileName);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_d = _h.return)) _d.call(_h);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                try {
                    // Any logically changed files need to be re-emitted. Most of the time this would happen
                    // regardless because the new dependency graph would _also_ identify the file as stale.
                    // However there are edge cases such as removing a component from an NgModule without adding
                    // it to another one, where the previous graph identifies the file as logically changed, but
                    // the new graph (which does not have that edge) fails to identify that the file should be
                    // re-emitted.
                    for (var logicalChanges_1 = tslib_1.__values(logicalChanges), logicalChanges_1_1 = logicalChanges_1.next(); !logicalChanges_1_1.done; logicalChanges_1_1 = logicalChanges_1.next()) {
                        var change = logicalChanges_1_1.value;
                        state.pendingEmit.add(change);
                        state.pendingTypeCheckEmit.add(change);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (logicalChanges_1_1 && !logicalChanges_1_1.done && (_e = logicalChanges_1.return)) _e.call(logicalChanges_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
            // `state` now reflects the initial pending state of the current compilation.
            return new IncrementalDriver(state, depGraph, logicalChanges);
        };
        IncrementalDriver.fresh = function (program) {
            // Initialize the set of files which need to be emitted to the set of all TS files in the
            // program.
            var tsFiles = tsOnlyFiles(program);
            var state = {
                kind: BuildStateKind.Pending,
                pendingEmit: new Set(tsFiles.map(function (sf) { return sf.fileName; })),
                pendingTypeCheckEmit: new Set(tsFiles.map(function (sf) { return sf.fileName; })),
                changedResourcePaths: new Set(),
                changedTsPaths: new Set(),
                lastGood: null,
                semanticDepGraphUpdater: new semantic_graph_1.SemanticDepGraphUpdater(/* priorGraph */ null),
            };
            return new IncrementalDriver(state, new dependency_tracking_1.FileDependencyGraph(), /* logicalChanges */ null);
        };
        IncrementalDriver.prototype.getSemanticDepGraphUpdater = function () {
            if (this.state.kind !== BuildStateKind.Pending) {
                throw new Error('Semantic dependency updater is only available when pending analysis');
            }
            return this.state.semanticDepGraphUpdater;
        };
        IncrementalDriver.prototype.recordSuccessfulAnalysis = function (traitCompiler) {
            var e_6, _a, e_7, _b;
            if (this.state.kind !== BuildStateKind.Pending) {
                // Changes have already been incorporated.
                return;
            }
            var _c = this.state.semanticDepGraphUpdater.finalize(), needsEmit = _c.needsEmit, needsTypeCheckEmit = _c.needsTypeCheckEmit, newGraph = _c.newGraph;
            var pendingEmit = this.state.pendingEmit;
            try {
                for (var needsEmit_1 = tslib_1.__values(needsEmit), needsEmit_1_1 = needsEmit_1.next(); !needsEmit_1_1.done; needsEmit_1_1 = needsEmit_1.next()) {
                    var path = needsEmit_1_1.value;
                    pendingEmit.add(path);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (needsEmit_1_1 && !needsEmit_1_1.done && (_a = needsEmit_1.return)) _a.call(needsEmit_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            var pendingTypeCheckEmit = this.state.pendingTypeCheckEmit;
            try {
                for (var needsTypeCheckEmit_1 = tslib_1.__values(needsTypeCheckEmit), needsTypeCheckEmit_1_1 = needsTypeCheckEmit_1.next(); !needsTypeCheckEmit_1_1.done; needsTypeCheckEmit_1_1 = needsTypeCheckEmit_1.next()) {
                    var path = needsTypeCheckEmit_1_1.value;
                    pendingTypeCheckEmit.add(path);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (needsTypeCheckEmit_1_1 && !needsTypeCheckEmit_1_1.done && (_b = needsTypeCheckEmit_1.return)) _b.call(needsTypeCheckEmit_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            // Update the state to an `AnalyzedBuildState`.
            this.state = {
                kind: BuildStateKind.Analyzed,
                pendingEmit: pendingEmit,
                pendingTypeCheckEmit: pendingTypeCheckEmit,
                // Since this compilation was successfully analyzed, update the "last good" artifacts to the
                // ones from the current compilation.
                lastGood: {
                    depGraph: this.depGraph,
                    semanticDepGraph: newGraph,
                    traitCompiler: traitCompiler,
                    typeCheckingResults: null,
                },
                priorTypeCheckingResults: this.state.lastGood !== null ? this.state.lastGood.typeCheckingResults : null,
            };
        };
        IncrementalDriver.prototype.recordSuccessfulTypeCheck = function (results) {
            var e_8, _a;
            if (this.state.lastGood === null || this.state.kind !== BuildStateKind.Analyzed) {
                return;
            }
            this.state.lastGood.typeCheckingResults = results;
            try {
                // Delete the files for which type-check code was generated from the set of pending type-check
                // files.
                for (var _b = tslib_1.__values(results.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var fileName = _c.value;
                    this.state.pendingTypeCheckEmit.delete(fileName);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
        };
        IncrementalDriver.prototype.recordSuccessfulEmit = function (sf) {
            this.state.pendingEmit.delete(sf.fileName);
        };
        IncrementalDriver.prototype.safeToSkipEmit = function (sf) {
            return !this.state.pendingEmit.has(sf.fileName);
        };
        IncrementalDriver.prototype.priorWorkFor = function (sf) {
            if (this.state.lastGood === null || this.logicalChanges === null) {
                // There is no previous good build, so no prior work exists.
                return null;
            }
            else if (this.logicalChanges.has(sf.fileName)) {
                // Prior work might exist, but would be stale as the file in question has logically changed.
                return null;
            }
            else {
                // Prior work might exist, and if it does then it's usable!
                return this.state.lastGood.traitCompiler.recordsFor(sf);
            }
        };
        IncrementalDriver.prototype.priorTypeCheckingResultsFor = function (sf) {
            if (this.state.kind !== BuildStateKind.Analyzed ||
                this.state.priorTypeCheckingResults === null || this.logicalChanges === null) {
                return null;
            }
            if (this.logicalChanges.has(sf.fileName) || this.state.pendingTypeCheckEmit.has(sf.fileName)) {
                return null;
            }
            var fileName = file_system_1.absoluteFromSourceFile(sf);
            if (!this.state.priorTypeCheckingResults.has(fileName)) {
                return null;
            }
            var data = this.state.priorTypeCheckingResults.get(fileName);
            if (data.hasInlines) {
                return null;
            }
            return data;
        };
        return IncrementalDriver;
    }());
    exports.IncrementalDriver = IncrementalDriver;
    var BuildStateKind;
    (function (BuildStateKind) {
        BuildStateKind[BuildStateKind["Pending"] = 0] = "Pending";
        BuildStateKind[BuildStateKind["Analyzed"] = 1] = "Analyzed";
    })(BuildStateKind || (BuildStateKind = {}));
    function tsOnlyFiles(program) {
        return program.getSourceFiles().filter(function (sf) { return !sf.isDeclarationFile; });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2luY3JlbWVudGFsL3NyYy9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBSUgsMkVBQXVGO0lBS3ZGLDZGQUE0RTtJQUU1RSwyR0FBMEQ7SUFFMUQ7O09BRUc7SUFDSDtRQVFFLDJCQUNJLEtBQXdCLEVBQVcsUUFBNkIsRUFDeEQsY0FBZ0M7WUFETCxhQUFRLEdBQVIsUUFBUSxDQUFxQjtZQUN4RCxtQkFBYyxHQUFkLGNBQWMsQ0FBa0I7WUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDckIsQ0FBQztRQUVEOzs7Ozs7V0FNRztRQUNJLDJCQUFTLEdBQWhCLFVBQ0ksVUFBc0IsRUFBRSxTQUE0QixFQUFFLFVBQXNCLEVBQzVFLHFCQUF1Qzs7WUFDekMsdUVBQXVFO1lBQ3ZFLElBQUksS0FBd0IsQ0FBQztZQUM3QixJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLGNBQWMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ25ELDhGQUE4RjtnQkFDOUYsY0FBYztnQkFDZCxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQzthQUN6QjtpQkFBTTtnQkFDTCxJQUFJLFVBQVUsR0FBMEIsSUFBSSxDQUFDO2dCQUM3QyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtvQkFDckMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO2lCQUN4RDtnQkFFRCx3RkFBd0Y7Z0JBQ3hGLDJCQUEyQjtnQkFDM0IsS0FBSyxHQUFHO29CQUNOLElBQUksRUFBRSxjQUFjLENBQUMsT0FBTztvQkFDNUIsV0FBVyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENB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LE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzVGLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFNLFFBQVEsR0FBRyxvQ0FBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3RELE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUUsQ0FBQztZQUNoRSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDSCx3QkFBQztJQUFELENBQUMsQUEvUEQsSUErUEM7SUEvUFksOENBQWlCO0lBbVE5QixJQUFLLGNBR0o7SUFIRCxXQUFLLGNBQWM7UUFDakIseURBQU8sQ0FBQTtRQUNQLDJEQUFRLENBQUE7SUFDVixDQUFDLEVBSEksY0FBYyxLQUFkLGNBQWMsUUFHbEI7SUF1SEQsU0FBUyxXQUFXLENBQUMsT0FBbUI7UUFDdEMsT0FBTyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQXJCLENBQXFCLENBQUMsQ0FBQztJQUN0RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2Fic29sdXRlRnJvbSwgYWJzb2x1dGVGcm9tU291cmNlRmlsZSwgQWJzb2x1dGVGc1BhdGh9IGZyb20gJy4uLy4uL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge0NsYXNzUmVjb3JkLCBUcmFpdENvbXBpbGVyfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtGaWxlVHlwZUNoZWNraW5nRGF0YX0gZnJvbSAnLi4vLi4vdHlwZWNoZWNrL3NyYy9jaGVja2VyJztcbmltcG9ydCB7SW5jcmVtZW50YWxCdWlsZH0gZnJvbSAnLi4vYXBpJztcbmltcG9ydCB7U2VtYW50aWNEZXBHcmFwaCwgU2VtYW50aWNEZXBHcmFwaFVwZGF0ZXJ9IGZyb20gJy4uL3NlbWFudGljX2dyYXBoJztcblxuaW1wb3J0IHtGaWxlRGVwZW5kZW5jeUdyYXBofSBmcm9tICcuL2RlcGVuZGVuY3lfdHJhY2tpbmcnO1xuXG4vKipcbiAqIERyaXZlcyBhbiBpbmNyZW1lbnRhbCBidWlsZCwgYnkgdHJhY2tpbmcgY2hhbmdlcyBhbmQgZGV0ZXJtaW5pbmcgd2hpY2ggZmlsZXMgbmVlZCB0byBiZSBlbWl0dGVkLlxuICovXG5leHBvcnQgY2xhc3MgSW5jcmVtZW50YWxEcml2ZXIgaW1wbGVtZW50cyBJbmNyZW1lbnRhbEJ1aWxkPENsYXNzUmVjb3JkLCBGaWxlVHlwZUNoZWNraW5nRGF0YT4ge1xuICAvKipcbiAgICogU3RhdGUgb2YgdGhlIGN1cnJlbnQgYnVpbGQuXG4gICAqXG4gICAqIFRoaXMgdHJhbnNpdGlvbnMgYXMgdGhlIGNvbXBpbGF0aW9uIHByb2dyZXNzZXMuXG4gICAqL1xuICBwcml2YXRlIHN0YXRlOiBCdWlsZFN0YXRlO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgICBzdGF0ZTogUGVuZGluZ0J1aWxkU3RhdGUsIHJlYWRvbmx5IGRlcEdyYXBoOiBGaWxlRGVwZW5kZW5jeUdyYXBoLFxuICAgICAgcHJpdmF0ZSBsb2dpY2FsQ2hhbmdlczogU2V0PHN0cmluZz58bnVsbCkge1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW4gYEluY3JlbWVudGFsRHJpdmVyYCB3aXRoIGEgc3RhcnRpbmcgc3RhdGUgdGhhdCBpbmNvcnBvcmF0ZXMgdGhlIHJlc3VsdHMgb2YgYVxuICAgKiBwcmV2aW91cyBidWlsZC5cbiAgICpcbiAgICogVGhlIHByZXZpb3VzIGJ1aWxkJ3MgYEJ1aWxkU3RhdGVgIGlzIHJlY29uY2lsZWQgd2l0aCB0aGUgbmV3IHByb2dyYW0ncyBjaGFuZ2VzLCBhbmQgdGhlIHJlc3VsdHNcbiAgICogYXJlIG1lcmdlZCBpbnRvIHRoZSBuZXcgYnVpbGQncyBgUGVuZGluZ0J1aWxkU3RhdGVgLlxuICAgKi9cbiAgc3RhdGljIHJlY29uY2lsZShcbiAgICAgIG9sZFByb2dyYW06IHRzLlByb2dyYW0sIG9sZERyaXZlcjogSW5jcmVtZW50YWxEcml2ZXIsIG5ld1Byb2dyYW06IHRzLlByb2dyYW0sXG4gICAgICBtb2RpZmllZFJlc291cmNlRmlsZXM6IFNldDxzdHJpbmc+fG51bGwpOiBJbmNyZW1lbnRhbERyaXZlciB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgc3RhdGUgb2YgdGhlIGN1cnJlbnQgYnVpbGQgYmFzZWQgb24gdGhlIHByZXZpb3VzIG9uZS5cbiAgICBsZXQgc3RhdGU6IFBlbmRpbmdCdWlsZFN0YXRlO1xuICAgIGlmIChvbGREcml2ZXIuc3RhdGUua2luZCA9PT0gQnVpbGRTdGF0ZUtpbmQuUGVuZGluZykge1xuICAgICAgLy8gVGhlIHByZXZpb3VzIGJ1aWxkIG5ldmVyIG1hZGUgaXQgcGFzdCB0aGUgcGVuZGluZyBzdGF0ZS4gUmV1c2UgaXQgYXMgdGhlIHN0YXJ0aW5nIHN0YXRlIGZvclxuICAgICAgLy8gdGhpcyBidWlsZC5cbiAgICAgIHN0YXRlID0gb2xkRHJpdmVyLnN0YXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcHJpb3JHcmFwaDogU2VtYW50aWNEZXBHcmFwaHxudWxsID0gbnVsbDtcbiAgICAgIGlmIChvbGREcml2ZXIuc3RhdGUubGFzdEdvb2QgIT09IG51bGwpIHtcbiAgICAgICAgcHJpb3JHcmFwaCA9IG9sZERyaXZlci5zdGF0ZS5sYXN0R29vZC5zZW1hbnRpY0RlcEdyYXBoO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcHJldmlvdXMgYnVpbGQgd2FzIHN1Y2Nlc3NmdWxseSBhbmFseXplZC4gYHBlbmRpbmdFbWl0YCBpcyB0aGUgb25seSBzdGF0ZSBjYXJyaWVkXG4gICAgICAvLyBmb3J3YXJkIGludG8gdGhpcyBidWlsZC5cbiAgICAgIHN0YXRlID0ge1xuICAgICAgICBraW5kOiBCdWlsZFN0YXRlS2luZC5QZW5kaW5nLFxuICAgICAgICBwZW5kaW5nRW1pdDogb2xkRHJpdmVyLnN0YXRlLnBlbmRpbmdFbWl0LFxuICAgICAgICBwZW5kaW5nVHlwZUNoZWNrRW1pdDogb2xkRHJpdmVyLnN0YXRlLnBlbmRpbmdUeXBlQ2hlY2tFbWl0LFxuICAgICAgICBjaGFuZ2VkUmVzb3VyY2VQYXRoczogbmV3IFNldDxBYnNvbHV0ZUZzUGF0aD4oKSxcbiAgICAgICAgY2hhbmdlZFRzUGF0aHM6IG5ldyBTZXQ8c3RyaW5nPigpLFxuICAgICAgICBsYXN0R29vZDogb2xkRHJpdmVyLnN0YXRlLmxhc3RHb29kLFxuICAgICAgICBzZW1hbnRpY0RlcEdyYXBoVXBkYXRlcjogbmV3IFNlbWFudGljRGVwR3JhcGhVcGRhdGVyKHByaW9yR3JhcGgpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBNZXJnZSB0aGUgZnJlc2hseSBtb2RpZmllZCByZXNvdXJjZSBmaWxlcyB3aXRoIGFueSBwcmlvciBvbmVzLlxuICAgIGlmIChtb2RpZmllZFJlc291cmNlRmlsZXMgIT09IG51bGwpIHtcbiAgICAgIGZvciAoY29uc3QgcmVzRmlsZSBvZiBtb2RpZmllZFJlc291cmNlRmlsZXMpIHtcbiAgICAgICAgc3RhdGUuY2hhbmdlZFJlc291cmNlUGF0aHMuYWRkKGFic29sdXRlRnJvbShyZXNGaWxlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTmV4dCwgcHJvY2VzcyB0aGUgZmlsZXMgaW4gdGhlIG5ldyBwcm9ncmFtLCB3aXRoIGEgY291cGxlIG9mIGdvYWxzOlxuICAgIC8vIDEpIERldGVybWluZSB3aGljaCBUUyBmaWxlcyBoYXZlIGNoYW5nZWQsIGlmIGFueSwgYW5kIG1lcmdlIHRoZW0gaW50byBgY2hhbmdlZFRzRmlsZXNgLlxuICAgIC8vIDIpIFByb2R1Y2UgYSBsaXN0IG9mIFRTIGZpbGVzIHdoaWNoIG5vIGxvbmdlciBleGlzdCBpbiB0aGUgcHJvZ3JhbSAodGhleSd2ZSBiZWVuIGRlbGV0ZWRcbiAgICAvLyAgICBzaW5jZSB0aGUgcHJldmlvdXMgY29tcGlsYXRpb24pLiBUaGVzZSBuZWVkIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgc3RhdGUgdHJhY2tpbmcgdG8gYXZvaWRcbiAgICAvLyAgICBsZWFraW5nIG1lbW9yeS5cblxuICAgIC8vIEFsbCBmaWxlcyBpbiB0aGUgb2xkIHByb2dyYW0sIGZvciBlYXN5IGRldGVjdGlvbiBvZiBjaGFuZ2VzLlxuICAgIGNvbnN0IG9sZEZpbGVzID0gbmV3IFNldDx0cy5Tb3VyY2VGaWxlPihvbGRQcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkpO1xuXG4gICAgLy8gQXNzdW1lIGFsbCB0aGUgb2xkIGZpbGVzIHdlcmUgZGVsZXRlZCB0byBiZWdpbiB3aXRoLiBPbmx5IFRTIGZpbGVzIGFyZSB0cmFja2VkLlxuICAgIGNvbnN0IGRlbGV0ZWRUc1BhdGhzID0gbmV3IFNldDxzdHJpbmc+KHRzT25seUZpbGVzKG9sZFByb2dyYW0pLm1hcChzZiA9PiBzZi5maWxlTmFtZSkpO1xuXG4gICAgZm9yIChjb25zdCBuZXdGaWxlIG9mIG5ld1Byb2dyYW0uZ2V0U291cmNlRmlsZXMoKSkge1xuICAgICAgaWYgKCFuZXdGaWxlLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICAgIC8vIFRoaXMgZmlsZSBleGlzdHMgaW4gdGhlIG5ldyBwcm9ncmFtLCBzbyByZW1vdmUgaXQgZnJvbSBgZGVsZXRlZFRzUGF0aHNgLlxuICAgICAgICBkZWxldGVkVHNQYXRocy5kZWxldGUobmV3RmlsZS5maWxlTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvbGRGaWxlcy5oYXMobmV3RmlsZSkpIHtcbiAgICAgICAgLy8gVGhpcyBmaWxlIGhhc24ndCBjaGFuZ2VkOyBubyBuZWVkIHRvIGxvb2sgYXQgaXQgZnVydGhlci5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBmaWxlIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHN1Y2Nlc3NmdWwgYnVpbGQuIFRoZSBhcHByb3ByaWF0ZSByZWFjdGlvbiBkZXBlbmRzIG9uXG4gICAgICAvLyB3aGF0IGtpbmQgb2YgZmlsZSBpdCBpcy5cbiAgICAgIGlmICghbmV3RmlsZS5pc0RlY2xhcmF0aW9uRmlsZSkge1xuICAgICAgICAvLyBJdCdzIGEgLnRzIGZpbGUsIHNvIHRyYWNrIGl0IGFzIGEgY2hhbmdlLlxuICAgICAgICBzdGF0ZS5jaGFuZ2VkVHNQYXRocy5hZGQobmV3RmlsZS5maWxlTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJdCdzIGEgLmQudHMgZmlsZS4gQ3VycmVudGx5IHRoZSBjb21waWxlciBkb2VzIG5vdCBkbyBhIGdyZWF0IGpvYiBvZiB0cmFja2luZ1xuICAgICAgICAvLyBkZXBlbmRlbmNpZXMgb24gLmQudHMgZmlsZXMsIHNvIGJhaWwgb3V0IG9mIGluY3JlbWVudGFsIGJ1aWxkcyBoZXJlIGFuZCBkbyBhIGZ1bGwgYnVpbGQuXG4gICAgICAgIC8vIFRoaXMgdXN1YWxseSBvbmx5IGhhcHBlbnMgaWYgc29tZXRoaW5nIGluIG5vZGVfbW9kdWxlcyBjaGFuZ2VzLlxuICAgICAgICByZXR1cm4gSW5jcmVtZW50YWxEcml2ZXIuZnJlc2gobmV3UHJvZ3JhbSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIG5leHQgc3RlcCBpcyB0byByZW1vdmUgYW55IGRlbGV0ZWQgZmlsZXMgZnJvbSB0aGUgc3RhdGUuXG4gICAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBkZWxldGVkVHNQYXRocykge1xuICAgICAgc3RhdGUucGVuZGluZ0VtaXQuZGVsZXRlKGZpbGVQYXRoKTtcbiAgICAgIHN0YXRlLnBlbmRpbmdUeXBlQ2hlY2tFbWl0LmRlbGV0ZShmaWxlUGF0aCk7XG5cbiAgICAgIC8vIEV2ZW4gaWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCBpbiB0aGUgY3VycmVudCBjb21waWxhdGlvbiwgaXQgc3RpbGwgbWlnaHQgaGF2ZSBiZWVuIGNoYW5nZWRcbiAgICAgIC8vIGluIGEgcHJldmlvdXMgb25lLCBzbyBkZWxldGUgaXQgZnJvbSB0aGUgc2V0IG9mIGNoYW5nZWQgVFMgZmlsZXMsIGp1c3QgaW4gY2FzZS5cbiAgICAgIHN0YXRlLmNoYW5nZWRUc1BhdGhzLmRlbGV0ZShmaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgLy8gTm93LCBjaGFuZ2VkVHNQYXRocyBjb250YWlucyBwaHlzaWNhbGx5IGNoYW5nZWQgVFMgcGF0aHMuIFVzZSB0aGUgcHJldmlvdXMgcHJvZ3JhbSdzIGxvZ2ljYWxcbiAgICAvLyBkZXBlbmRlbmN5IGdyYXBoIHRvIGRldGVybWluZSBsb2dpY2FsbHkgY2hhbmdlZCBmaWxlcy5cbiAgICBjb25zdCBkZXBHcmFwaCA9IG5ldyBGaWxlRGVwZW5kZW5jeUdyYXBoKCk7XG5cbiAgICAvLyBJZiBhIHByZXZpb3VzIGNvbXBpbGF0aW9uIGV4aXN0cywgdXNlIGl0cyBkZXBlbmRlbmN5IGdyYXBoIHRvIGRldGVybWluZSB0aGUgc2V0IG9mIGxvZ2ljYWxseVxuICAgIC8vIGNoYW5nZWQgZmlsZXMuXG4gICAgbGV0IGxvZ2ljYWxDaGFuZ2VzOiBTZXQ8c3RyaW5nPnxudWxsID0gbnVsbDtcbiAgICBpZiAoc3RhdGUubGFzdEdvb2QgIT09IG51bGwpIHtcbiAgICAgIC8vIEV4dHJhY3QgdGhlIHNldCBvZiBsb2dpY2FsbHkgY2hhbmdlZCBmaWxlcy4gQXQgdGhlIHNhbWUgdGltZSwgdGhpcyBvcGVyYXRpb24gcG9wdWxhdGVzIHRoZVxuICAgICAgLy8gY3VycmVudCAoZnJlc2gpIGRlcGVuZGVuY3kgZ3JhcGggd2l0aCBpbmZvcm1hdGlvbiBhYm91dCB0aG9zZSBmaWxlcyB3aGljaCBoYXZlIG5vdFxuICAgICAgLy8gbG9naWNhbGx5IGNoYW5nZWQuXG4gICAgICBsb2dpY2FsQ2hhbmdlcyA9IGRlcEdyYXBoLnVwZGF0ZVdpdGhQaHlzaWNhbENoYW5nZXMoXG4gICAgICAgICAgc3RhdGUubGFzdEdvb2QuZGVwR3JhcGgsIHN0YXRlLmNoYW5nZWRUc1BhdGhzLCBkZWxldGVkVHNQYXRocyxcbiAgICAgICAgICBzdGF0ZS5jaGFuZ2VkUmVzb3VyY2VQYXRocyk7XG4gICAgICBmb3IgKGNvbnN0IGZpbGVOYW1lIG9mIHN0YXRlLmNoYW5nZWRUc1BhdGhzKSB7XG4gICAgICAgIGxvZ2ljYWxDaGFuZ2VzLmFkZChmaWxlTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFueSBsb2dpY2FsbHkgY2hhbmdlZCBmaWxlcyBuZWVkIHRvIGJlIHJlLWVtaXR0ZWQuIE1vc3Qgb2YgdGhlIHRpbWUgdGhpcyB3b3VsZCBoYXBwZW5cbiAgICAgIC8vIHJlZ2FyZGxlc3MgYmVjYXVzZSB0aGUgbmV3IGRlcGVuZGVuY3kgZ3JhcGggd291bGQgX2Fsc29fIGlkZW50aWZ5IHRoZSBmaWxlIGFzIHN0YWxlLlxuICAgICAgLy8gSG93ZXZlciB0aGVyZSBhcmUgZWRnZSBjYXNlcyBzdWNoIGFzIHJlbW92aW5nIGEgY29tcG9uZW50IGZyb20gYW4gTmdNb2R1bGUgd2l0aG91dCBhZGRpbmdcbiAgICAgIC8vIGl0IHRvIGFub3RoZXIgb25lLCB3aGVyZSB0aGUgcHJldmlvdXMgZ3JhcGggaWRlbnRpZmllcyB0aGUgZmlsZSBhcyBsb2dpY2FsbHkgY2hhbmdlZCwgYnV0XG4gICAgICAvLyB0aGUgbmV3IGdyYXBoICh3aGljaCBkb2VzIG5vdCBoYXZlIHRoYXQgZWRnZSkgZmFpbHMgdG8gaWRlbnRpZnkgdGhhdCB0aGUgZmlsZSBzaG91bGQgYmVcbiAgICAgIC8vIHJlLWVtaXR0ZWQuXG4gICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBsb2dpY2FsQ2hhbmdlcykge1xuICAgICAgICBzdGF0ZS5wZW5kaW5nRW1pdC5hZGQoY2hhbmdlKTtcbiAgICAgICAgc3RhdGUucGVuZGluZ1R5cGVDaGVja0VtaXQuYWRkKGNoYW5nZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYHN0YXRlYCBub3cgcmVmbGVjdHMgdGhlIGluaXRpYWwgcGVuZGluZyBzdGF0ZSBvZiB0aGUgY3VycmVudCBjb21waWxhdGlvbi5cblxuICAgIHJldHVybiBuZXcgSW5jcmVtZW50YWxEcml2ZXIoc3RhdGUsIGRlcEdyYXBoLCBsb2dpY2FsQ2hhbmdlcyk7XG4gIH1cblxuICBzdGF0aWMgZnJlc2gocHJvZ3JhbTogdHMuUHJvZ3JhbSk6IEluY3JlbWVudGFsRHJpdmVyIHtcbiAgICAvLyBJbml0aWFsaXplIHRoZSBzZXQgb2YgZmlsZXMgd2hpY2ggbmVlZCB0byBiZSBlbWl0dGVkIHRvIHRoZSBzZXQgb2YgYWxsIFRTIGZpbGVzIGluIHRoZVxuICAgIC8vIHByb2dyYW0uXG4gICAgY29uc3QgdHNGaWxlcyA9IHRzT25seUZpbGVzKHByb2dyYW0pO1xuXG4gICAgY29uc3Qgc3RhdGU6IFBlbmRpbmdCdWlsZFN0YXRlID0ge1xuICAgICAga2luZDogQnVpbGRTdGF0ZUtpbmQuUGVuZGluZyxcbiAgICAgIHBlbmRpbmdFbWl0OiBuZXcgU2V0PHN0cmluZz4odHNGaWxlcy5tYXAoc2YgPT4gc2YuZmlsZU5hbWUpKSxcbiAgICAgIHBlbmRpbmdUeXBlQ2hlY2tFbWl0OiBuZXcgU2V0PHN0cmluZz4odHNGaWxlcy5tYXAoc2YgPT4gc2YuZmlsZU5hbWUpKSxcbiAgICAgIGNoYW5nZWRSZXNvdXJjZVBhdGhzOiBuZXcgU2V0PEFic29sdXRlRnNQYXRoPigpLFxuICAgICAgY2hhbmdlZFRzUGF0aHM6IG5ldyBTZXQ8c3RyaW5nPigpLFxuICAgICAgbGFzdEdvb2Q6IG51bGwsXG4gICAgICBzZW1hbnRpY0RlcEdyYXBoVXBkYXRlcjogbmV3IFNlbWFudGljRGVwR3JhcGhVcGRhdGVyKC8qIHByaW9yR3JhcGggKi8gbnVsbCksXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgSW5jcmVtZW50YWxEcml2ZXIoc3RhdGUsIG5ldyBGaWxlRGVwZW5kZW5jeUdyYXBoKCksIC8qIGxvZ2ljYWxDaGFuZ2VzICovIG51bGwpO1xuICB9XG5cbiAgZ2V0U2VtYW50aWNEZXBHcmFwaFVwZGF0ZXIoKTogU2VtYW50aWNEZXBHcmFwaFVwZGF0ZXIge1xuICAgIGlmICh0aGlzLnN0YXRlLmtpbmQgIT09IEJ1aWxkU3RhdGVLaW5kLlBlbmRpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2VtYW50aWMgZGVwZW5kZW5jeSB1cGRhdGVyIGlzIG9ubHkgYXZhaWxhYmxlIHdoZW4gcGVuZGluZyBhbmFseXNpcycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZW1hbnRpY0RlcEdyYXBoVXBkYXRlcjtcbiAgfVxuXG4gIHJlY29yZFN1Y2Nlc3NmdWxBbmFseXNpcyh0cmFpdENvbXBpbGVyOiBUcmFpdENvbXBpbGVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RhdGUua2luZCAhPT0gQnVpbGRTdGF0ZUtpbmQuUGVuZGluZykge1xuICAgICAgLy8gQ2hhbmdlcyBoYXZlIGFscmVhZHkgYmVlbiBpbmNvcnBvcmF0ZWQuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge25lZWRzRW1pdCwgbmVlZHNUeXBlQ2hlY2tFbWl0LCBuZXdHcmFwaH0gPSB0aGlzLnN0YXRlLnNlbWFudGljRGVwR3JhcGhVcGRhdGVyLmZpbmFsaXplKCk7XG5cbiAgICBjb25zdCBwZW5kaW5nRW1pdCA9IHRoaXMuc3RhdGUucGVuZGluZ0VtaXQ7XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIG5lZWRzRW1pdCkge1xuICAgICAgcGVuZGluZ0VtaXQuYWRkKHBhdGgpO1xuICAgIH1cblxuICAgIGNvbnN0IHBlbmRpbmdUeXBlQ2hlY2tFbWl0ID0gdGhpcy5zdGF0ZS5wZW5kaW5nVHlwZUNoZWNrRW1pdDtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgbmVlZHNUeXBlQ2hlY2tFbWl0KSB7XG4gICAgICBwZW5kaW5nVHlwZUNoZWNrRW1pdC5hZGQocGF0aCk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBzdGF0ZSB0byBhbiBgQW5hbHl6ZWRCdWlsZFN0YXRlYC5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAga2luZDogQnVpbGRTdGF0ZUtpbmQuQW5hbHl6ZWQsXG4gICAgICBwZW5kaW5nRW1pdCxcbiAgICAgIHBlbmRpbmdUeXBlQ2hlY2tFbWl0LFxuXG4gICAgICAvLyBTaW5jZSB0aGlzIGNvbXBpbGF0aW9uIHdhcyBzdWNjZXNzZnVsbHkgYW5hbHl6ZWQsIHVwZGF0ZSB0aGUgXCJsYXN0IGdvb2RcIiBhcnRpZmFjdHMgdG8gdGhlXG4gICAgICAvLyBvbmVzIGZyb20gdGhlIGN1cnJlbnQgY29tcGlsYXRpb24uXG4gICAgICBsYXN0R29vZDoge1xuICAgICAgICBkZXBHcmFwaDogdGhpcy5kZXBHcmFwaCxcbiAgICAgICAgc2VtYW50aWNEZXBHcmFwaDogbmV3R3JhcGgsXG4gICAgICAgIHRyYWl0Q29tcGlsZXI6IHRyYWl0Q29tcGlsZXIsXG4gICAgICAgIHR5cGVDaGVja2luZ1Jlc3VsdHM6IG51bGwsXG4gICAgICB9LFxuXG4gICAgICBwcmlvclR5cGVDaGVja2luZ1Jlc3VsdHM6XG4gICAgICAgICAgdGhpcy5zdGF0ZS5sYXN0R29vZCAhPT0gbnVsbCA/IHRoaXMuc3RhdGUubGFzdEdvb2QudHlwZUNoZWNraW5nUmVzdWx0cyA6IG51bGwsXG4gICAgfTtcbiAgfVxuXG4gIHJlY29yZFN1Y2Nlc3NmdWxUeXBlQ2hlY2socmVzdWx0czogTWFwPEFic29sdXRlRnNQYXRoLCBGaWxlVHlwZUNoZWNraW5nRGF0YT4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5sYXN0R29vZCA9PT0gbnVsbCB8fCB0aGlzLnN0YXRlLmtpbmQgIT09IEJ1aWxkU3RhdGVLaW5kLkFuYWx5emVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhdGUubGFzdEdvb2QudHlwZUNoZWNraW5nUmVzdWx0cyA9IHJlc3VsdHM7XG5cbiAgICAvLyBEZWxldGUgdGhlIGZpbGVzIGZvciB3aGljaCB0eXBlLWNoZWNrIGNvZGUgd2FzIGdlbmVyYXRlZCBmcm9tIHRoZSBzZXQgb2YgcGVuZGluZyB0eXBlLWNoZWNrXG4gICAgLy8gZmlsZXMuXG4gICAgZm9yIChjb25zdCBmaWxlTmFtZSBvZiByZXN1bHRzLmtleXMoKSkge1xuICAgICAgdGhpcy5zdGF0ZS5wZW5kaW5nVHlwZUNoZWNrRW1pdC5kZWxldGUoZmlsZU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHJlY29yZFN1Y2Nlc3NmdWxFbWl0KHNmOiB0cy5Tb3VyY2VGaWxlKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZS5wZW5kaW5nRW1pdC5kZWxldGUoc2YuZmlsZU5hbWUpO1xuICB9XG5cbiAgc2FmZVRvU2tpcEVtaXQoc2Y6IHRzLlNvdXJjZUZpbGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuc3RhdGUucGVuZGluZ0VtaXQuaGFzKHNmLmZpbGVOYW1lKTtcbiAgfVxuXG4gIHByaW9yV29ya0ZvcihzZjogdHMuU291cmNlRmlsZSk6IENsYXNzUmVjb3JkW118bnVsbCB7XG4gICAgaWYgKHRoaXMuc3RhdGUubGFzdEdvb2QgPT09IG51bGwgfHwgdGhpcy5sb2dpY2FsQ2hhbmdlcyA9PT0gbnVsbCkge1xuICAgICAgLy8gVGhlcmUgaXMgbm8gcHJldmlvdXMgZ29vZCBidWlsZCwgc28gbm8gcHJpb3Igd29yayBleGlzdHMuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9naWNhbENoYW5nZXMuaGFzKHNmLmZpbGVOYW1lKSkge1xuICAgICAgLy8gUHJpb3Igd29yayBtaWdodCBleGlzdCwgYnV0IHdvdWxkIGJlIHN0YWxlIGFzIHRoZSBmaWxlIGluIHF1ZXN0aW9uIGhhcyBsb2dpY2FsbHkgY2hhbmdlZC5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQcmlvciB3b3JrIG1pZ2h0IGV4aXN0LCBhbmQgaWYgaXQgZG9lcyB0aGVuIGl0J3MgdXNhYmxlIVxuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUubGFzdEdvb2QudHJhaXRDb21waWxlci5yZWNvcmRzRm9yKHNmKTtcbiAgICB9XG4gIH1cblxuICBwcmlvclR5cGVDaGVja2luZ1Jlc3VsdHNGb3Ioc2Y6IHRzLlNvdXJjZUZpbGUpOiBGaWxlVHlwZUNoZWNraW5nRGF0YXxudWxsIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5raW5kICE9PSBCdWlsZFN0YXRlS2luZC5BbmFseXplZCB8fFxuICAgICAgICB0aGlzLnN0YXRlLnByaW9yVHlwZUNoZWNraW5nUmVzdWx0cyA9PT0gbnVsbCB8fCB0aGlzLmxvZ2ljYWxDaGFuZ2VzID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5sb2dpY2FsQ2hhbmdlcy5oYXMoc2YuZmlsZU5hbWUpIHx8IHRoaXMuc3RhdGUucGVuZGluZ1R5cGVDaGVja0VtaXQuaGFzKHNmLmZpbGVOYW1lKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZU5hbWUgPSBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlKHNmKTtcbiAgICBpZiAoIXRoaXMuc3RhdGUucHJpb3JUeXBlQ2hlY2tpbmdSZXN1bHRzLmhhcyhmaWxlTmFtZSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkYXRhID0gdGhpcy5zdGF0ZS5wcmlvclR5cGVDaGVja2luZ1Jlc3VsdHMuZ2V0KGZpbGVOYW1lKSE7XG4gICAgaWYgKGRhdGEuaGFzSW5saW5lcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cblxudHlwZSBCdWlsZFN0YXRlID0gUGVuZGluZ0J1aWxkU3RhdGV8QW5hbHl6ZWRCdWlsZFN0YXRlO1xuXG5lbnVtIEJ1aWxkU3RhdGVLaW5kIHtcbiAgUGVuZGluZyxcbiAgQW5hbHl6ZWQsXG59XG5cbmludGVyZmFjZSBCYXNlQnVpbGRTdGF0ZSB7XG4gIGtpbmQ6IEJ1aWxkU3RhdGVLaW5kO1xuXG4gIC8qKlxuICAgKiBUaGUgaGVhcnQgb2YgaW5jcmVtZW50YWwgYnVpbGRzLiBUaGlzIGBTZXRgIHRyYWNrcyB0aGUgc2V0IG9mIGZpbGVzIHdoaWNoIG5lZWQgdG8gYmUgZW1pdHRlZFxuICAgKiBkdXJpbmcgdGhlIGN1cnJlbnQgY29tcGlsYXRpb24uXG4gICAqXG4gICAqIFRoaXMgc3RhcnRzIG91dCBhcyB0aGUgc2V0IG9mIGZpbGVzIHdoaWNoIGFyZSBzdGlsbCBwZW5kaW5nIGZyb20gdGhlIHByZXZpb3VzIHByb2dyYW0gKG9yIHRoZVxuICAgKiBmdWxsIHNldCBvZiAudHMgZmlsZXMgb24gYSBmcmVzaCBidWlsZCkuXG4gICAqXG4gICAqIEFmdGVyIGFuYWx5c2lzLCBpdCdzIHVwZGF0ZWQgdG8gaW5jbHVkZSBhbnkgZmlsZXMgd2hpY2ggbWlnaHQgaGF2ZSBjaGFuZ2VkIGFuZCBuZWVkIGEgcmUtZW1pdFxuICAgKiBhcyBhIHJlc3VsdCBvZiBpbmNyZW1lbnRhbCBjaGFuZ2VzLlxuICAgKlxuICAgKiBJZiBhbiBlbWl0IGhhcHBlbnMsIGFueSB3cml0dGVuIGZpbGVzIGFyZSByZW1vdmVkIGZyb20gdGhlIGBTZXRgLCBhcyB0aGV5J3JlIG5vIGxvbmdlclxuICAgKiBwZW5kaW5nLlxuICAgKlxuICAgKiBUaHVzLCBhZnRlciBjb21waWxhdGlvbiBgcGVuZGluZ0VtaXRgIHNob3VsZCBiZSBlbXB0eSAob24gYSBzdWNjZXNzZnVsIGJ1aWxkKSBvciBjb250YWluIHRoZVxuICAgKiBmaWxlcyB3aGljaCBzdGlsbCBuZWVkIHRvIGJlIGVtaXR0ZWQgYnV0IGhhdmUgbm90IHlldCBiZWVuIChkdWUgdG8gZXJyb3JzKS5cbiAgICpcbiAgICogYHBlbmRpbmdFbWl0YCBpcyB0cmFja2VkIGFzIGFzIGBTZXQ8c3RyaW5nPmAgaW5zdGVhZCBvZiBhIGBTZXQ8dHMuU291cmNlRmlsZT5gLCBiZWNhdXNlIHRoZVxuICAgKiBjb250ZW50cyBvZiB0aGUgZmlsZSBhcmUgbm90IGltcG9ydGFudCBoZXJlLCBvbmx5IHdoZXRoZXIgb3Igbm90IHRoZSBjdXJyZW50IHZlcnNpb24gb2YgaXRcbiAgICogbmVlZHMgdG8gYmUgZW1pdHRlZC4gVGhlIGBzdHJpbmdgcyBoZXJlIGFyZSBUUyBmaWxlIHBhdGhzLlxuICAgKlxuICAgKiBTZWUgdGhlIFJFQURNRS5tZCBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGlzIGFsZ29yaXRobS5cbiAgICovXG4gIHBlbmRpbmdFbWl0OiBTZXQ8c3RyaW5nPjtcblxuICAvKipcbiAgICogU2ltaWxhciB0byBgcGVuZGluZ0VtaXRgLCBidXQgdGhlbiBmb3IgcmVwcmVzZW50aW5nIHRoZSBzZXQgb2YgZmlsZXMgZm9yIHdoaWNoIHRoZSB0eXBlLWNoZWNrXG4gICAqIGZpbGUgc2hvdWxkIGJlIHJlZ2VuZXJhdGVkLiBJdCBiZWhhdmVzIGlkZW50aWNhbGx5IHdpdGggcmVzcGVjdCB0byBlcnJvcmVkIGNvbXBpbGF0aW9ucyBhc1xuICAgKiBgcGVuZGluZ0VtaXRgLlxuICAgKi9cbiAgcGVuZGluZ1R5cGVDaGVja0VtaXQ6IFNldDxzdHJpbmc+O1xuXG5cbiAgLyoqXG4gICAqIFNwZWNpZmljIGFzcGVjdHMgb2YgdGhlIGxhc3QgY29tcGlsYXRpb24gd2hpY2ggc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZCBhbmFseXNpcywgaWYgYW55LlxuICAgKi9cbiAgbGFzdEdvb2Q6IHtcbiAgICAvKipcbiAgICAgKiBUaGUgZGVwZW5kZW5jeSBncmFwaCBmcm9tIHRoZSBsYXN0IHN1Y2Nlc3NmdWxseSBhbmFseXplZCBidWlsZC5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIGxvZ2ljYWwgaW1wYWN0IG9mIHBoeXNpY2FsIGZpbGUgY2hhbmdlcy5cbiAgICAgKi9cbiAgICBkZXBHcmFwaDogRmlsZURlcGVuZGVuY3lHcmFwaDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzZW1hbnRpYyBkZXBlbmRlbmN5IGdyYXBoIGZyb20gdGhlIGxhc3Qgc3VjY2Vzc2Z1bGx5IGFuYWx5emVkIGJ1aWxkLlxuICAgICAqXG4gICAgICogVGhpcyBpcyB1c2VkIHRvIHBlcmZvcm0gaW4tZGVwdGggY29tcGFyaXNvbiBvZiBBbmd1bGFyIGRlY29yYXRlZCBjbGFzc2VzLCB0byBkZXRlcm1pbmVcbiAgICAgKiB3aGljaCBmaWxlcyBoYXZlIHRvIGJlIHJlLWVtaXR0ZWQgYW5kL29yIHJlLXR5cGUtY2hlY2tlZC5cbiAgICAgKi9cbiAgICBzZW1hbnRpY0RlcEdyYXBoOiBTZW1hbnRpY0RlcEdyYXBoO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBUcmFpdENvbXBpbGVyYCBmcm9tIHRoZSBsYXN0IHN1Y2Nlc3NmdWxseSBhbmFseXplZCBidWlsZC5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdXNlZCB0byBleHRyYWN0IFwicHJpb3Igd29ya1wiIHdoaWNoIG1pZ2h0IGJlIHJldXNhYmxlIGluIHRoaXMgY29tcGlsYXRpb24uXG4gICAgICovXG4gICAgdHJhaXRDb21waWxlcjogVHJhaXRDb21waWxlcjtcblxuICAgIC8qKlxuICAgICAqIFR5cGUgY2hlY2tpbmcgcmVzdWx0cyB3aGljaCB3aWxsIGJlIHBhc3NlZCBvbnRvIHRoZSBuZXh0IGJ1aWxkLlxuICAgICAqL1xuICAgIHR5cGVDaGVja2luZ1Jlc3VsdHM6IE1hcDxBYnNvbHV0ZUZzUGF0aCwgRmlsZVR5cGVDaGVja2luZ0RhdGE+fCBudWxsO1xuICB9fG51bGw7XG59XG5cbi8qKlxuICogU3RhdGUgb2YgYSBidWlsZCBiZWZvcmUgdGhlIEFuZ3VsYXIgYW5hbHlzaXMgcGhhc2UgY29tcGxldGVzLlxuICovXG5pbnRlcmZhY2UgUGVuZGluZ0J1aWxkU3RhdGUgZXh0ZW5kcyBCYXNlQnVpbGRTdGF0ZSB7XG4gIGtpbmQ6IEJ1aWxkU3RhdGVLaW5kLlBlbmRpbmc7XG5cbiAgLyoqXG4gICAqIFNldCBvZiBmaWxlcyB3aGljaCBhcmUga25vd24gdG8gbmVlZCBhbiBlbWl0LlxuICAgKlxuICAgKiBCZWZvcmUgdGhlIGNvbXBpbGVyJ3MgYW5hbHlzaXMgcGhhc2UgY29tcGxldGVzLCBgcGVuZGluZ0VtaXRgIG9ubHkgY29udGFpbnMgZmlsZXMgdGhhdCB3ZXJlXG4gICAqIHN0aWxsIHBlbmRpbmcgYWZ0ZXIgdGhlIHByZXZpb3VzIGJ1aWxkLlxuICAgKi9cbiAgcGVuZGluZ0VtaXQ6IFNldDxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBTZXQgb2YgVHlwZVNjcmlwdCBmaWxlIHBhdGhzIHdoaWNoIGhhdmUgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCBzdWNjZXNzZnVsbHkgYW5hbHl6ZWQgYnVpbGQuXG4gICAqL1xuICBjaGFuZ2VkVHNQYXRoczogU2V0PHN0cmluZz47XG5cbiAgLyoqXG4gICAqIFNldCBvZiByZXNvdXJjZSBmaWxlIHBhdGhzIHdoaWNoIGhhdmUgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCBzdWNjZXNzZnVsbHkgYW5hbHl6ZWQgYnVpbGQuXG4gICAqL1xuICBjaGFuZ2VkUmVzb3VyY2VQYXRoczogU2V0PEFic29sdXRlRnNQYXRoPjtcblxuICAvKipcbiAgICogSW4gYSBwZW5kaW5nIHN0YXRlLCB0aGUgc2VtYW50aWMgZGVwZW5kZW5jeSBncmFwaCBpcyBhdmFpbGFibGUgdG8gdGhlIGNvbXBpbGF0aW9uIHRvIHJlZ2lzdGVyXG4gICAqIHRoZSBpbmNyZW1lbnRhbCBzeW1ib2xzIGludG8uXG4gICAqL1xuICBzZW1hbnRpY0RlcEdyYXBoVXBkYXRlcjogU2VtYW50aWNEZXBHcmFwaFVwZGF0ZXI7XG59XG5cbmludGVyZmFjZSBBbmFseXplZEJ1aWxkU3RhdGUgZXh0ZW5kcyBCYXNlQnVpbGRTdGF0ZSB7XG4gIGtpbmQ6IEJ1aWxkU3RhdGVLaW5kLkFuYWx5emVkO1xuXG4gIC8qKlxuICAgKiBTZXQgb2YgZmlsZXMgd2hpY2ggYXJlIGtub3duIHRvIG5lZWQgYW4gZW1pdC5cbiAgICpcbiAgICogQWZ0ZXIgYW5hbHlzaXMgY29tcGxldGVzICh0aGF0IGlzLCB0aGUgc3RhdGUgdHJhbnNpdGlvbnMgdG8gYEFuYWx5emVkQnVpbGRTdGF0ZWApLCB0aGVcbiAgICogYHBlbmRpbmdFbWl0YCBzZXQgdGFrZXMgaW50byBhY2NvdW50IGFueSBvbi1kaXNrIGNoYW5nZXMgbWFkZSBzaW5jZSB0aGUgbGFzdCBzdWNjZXNzZnVsbHlcbiAgICogYW5hbHl6ZWQgYnVpbGQuXG4gICAqL1xuICBwZW5kaW5nRW1pdDogU2V0PHN0cmluZz47XG5cbiAgLyoqXG4gICAqIFR5cGUgY2hlY2tpbmcgcmVzdWx0cyBmcm9tIHRoZSBwcmV2aW91cyBjb21waWxhdGlvbiwgd2hpY2ggY2FuIGJlIHJldXNlZCBpbiB0aGlzIG9uZS5cbiAgICovXG4gIHByaW9yVHlwZUNoZWNraW5nUmVzdWx0czogTWFwPEFic29sdXRlRnNQYXRoLCBGaWxlVHlwZUNoZWNraW5nRGF0YT58bnVsbDtcbn1cblxuZnVuY3Rpb24gdHNPbmx5RmlsZXMocHJvZ3JhbTogdHMuUHJvZ3JhbSk6IFJlYWRvbmx5QXJyYXk8dHMuU291cmNlRmlsZT4ge1xuICByZXR1cm4gcHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpLmZpbHRlcihzZiA9PiAhc2YuaXNEZWNsYXJhdGlvbkZpbGUpO1xufVxuIl19