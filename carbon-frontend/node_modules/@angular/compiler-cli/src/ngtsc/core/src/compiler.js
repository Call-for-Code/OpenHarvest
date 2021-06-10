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
        define("@angular/compiler-cli/src/ngtsc/core/src/compiler", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/annotations", "@angular/compiler-cli/src/ngtsc/cycles", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/entry_point", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/incremental", "@angular/compiler-cli/src/ngtsc/indexer", "@angular/compiler-cli/src/ngtsc/metadata", "@angular/compiler-cli/src/ngtsc/modulewithproviders", "@angular/compiler-cli/src/ngtsc/partial_evaluator", "@angular/compiler-cli/src/ngtsc/perf", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/resource", "@angular/compiler-cli/src/ngtsc/routing", "@angular/compiler-cli/src/ngtsc/scope", "@angular/compiler-cli/src/ngtsc/shims", "@angular/compiler-cli/src/ngtsc/switch", "@angular/compiler-cli/src/ngtsc/transform", "@angular/compiler-cli/src/ngtsc/typecheck", "@angular/compiler-cli/src/ngtsc/typecheck/api", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/core/src/config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAngularCorePackage = exports.NgCompiler = exports.resourceChangeTicket = exports.incrementalFromDriverTicket = exports.incrementalFromCompilerTicket = exports.freshCompilationTicket = exports.CompilationTicketKind = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var annotations_1 = require("@angular/compiler-cli/src/ngtsc/annotations");
    var cycles_1 = require("@angular/compiler-cli/src/ngtsc/cycles");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var entry_point_1 = require("@angular/compiler-cli/src/ngtsc/entry_point");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var incremental_1 = require("@angular/compiler-cli/src/ngtsc/incremental");
    var indexer_1 = require("@angular/compiler-cli/src/ngtsc/indexer");
    var metadata_1 = require("@angular/compiler-cli/src/ngtsc/metadata");
    var modulewithproviders_1 = require("@angular/compiler-cli/src/ngtsc/modulewithproviders");
    var partial_evaluator_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator");
    var perf_1 = require("@angular/compiler-cli/src/ngtsc/perf");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var resource_1 = require("@angular/compiler-cli/src/ngtsc/resource");
    var routing_1 = require("@angular/compiler-cli/src/ngtsc/routing");
    var scope_1 = require("@angular/compiler-cli/src/ngtsc/scope");
    var shims_1 = require("@angular/compiler-cli/src/ngtsc/shims");
    var switch_1 = require("@angular/compiler-cli/src/ngtsc/switch");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    var typecheck_1 = require("@angular/compiler-cli/src/ngtsc/typecheck");
    var api_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/api");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var config_1 = require("@angular/compiler-cli/src/ngtsc/core/src/config");
    /**
     * Discriminant type for a `CompilationTicket`.
     */
    var CompilationTicketKind;
    (function (CompilationTicketKind) {
        CompilationTicketKind[CompilationTicketKind["Fresh"] = 0] = "Fresh";
        CompilationTicketKind[CompilationTicketKind["IncrementalTypeScript"] = 1] = "IncrementalTypeScript";
        CompilationTicketKind[CompilationTicketKind["IncrementalResource"] = 2] = "IncrementalResource";
    })(CompilationTicketKind = exports.CompilationTicketKind || (exports.CompilationTicketKind = {}));
    /**
     * Create a `CompilationTicket` for a brand new compilation, using no prior state.
     */
    function freshCompilationTicket(tsProgram, options, incrementalBuildStrategy, typeCheckingProgramStrategy, enableTemplateTypeChecker, usePoisonedData) {
        return {
            kind: CompilationTicketKind.Fresh,
            tsProgram: tsProgram,
            options: options,
            incrementalBuildStrategy: incrementalBuildStrategy,
            typeCheckingProgramStrategy: typeCheckingProgramStrategy,
            enableTemplateTypeChecker: enableTemplateTypeChecker,
            usePoisonedData: usePoisonedData,
        };
    }
    exports.freshCompilationTicket = freshCompilationTicket;
    /**
     * Create a `CompilationTicket` as efficiently as possible, based on a previous `NgCompiler`
     * instance and a new `ts.Program`.
     */
    function incrementalFromCompilerTicket(oldCompiler, newProgram, incrementalBuildStrategy, typeCheckingProgramStrategy, modifiedResourceFiles) {
        var oldProgram = oldCompiler.getNextProgram();
        var oldDriver = oldCompiler.incrementalStrategy.getIncrementalDriver(oldProgram);
        if (oldDriver === null) {
            // No incremental step is possible here, since no IncrementalDriver was found for the old
            // program.
            return freshCompilationTicket(newProgram, oldCompiler.options, incrementalBuildStrategy, typeCheckingProgramStrategy, oldCompiler.enableTemplateTypeChecker, oldCompiler.usePoisonedData);
        }
        var newDriver = incremental_1.IncrementalDriver.reconcile(oldProgram, oldDriver, newProgram, modifiedResourceFiles);
        return {
            kind: CompilationTicketKind.IncrementalTypeScript,
            enableTemplateTypeChecker: oldCompiler.enableTemplateTypeChecker,
            usePoisonedData: oldCompiler.usePoisonedData,
            options: oldCompiler.options,
            incrementalBuildStrategy: incrementalBuildStrategy,
            typeCheckingProgramStrategy: typeCheckingProgramStrategy,
            newDriver: newDriver,
            oldProgram: oldProgram,
            newProgram: newProgram,
        };
    }
    exports.incrementalFromCompilerTicket = incrementalFromCompilerTicket;
    /**
     * Create a `CompilationTicket` directly from an old `ts.Program` and associated Angular compilation
     * state, along with a new `ts.Program`.
     */
    function incrementalFromDriverTicket(oldProgram, oldDriver, newProgram, options, incrementalBuildStrategy, typeCheckingProgramStrategy, modifiedResourceFiles, enableTemplateTypeChecker, usePoisonedData) {
        var newDriver = incremental_1.IncrementalDriver.reconcile(oldProgram, oldDriver, newProgram, modifiedResourceFiles);
        return {
            kind: CompilationTicketKind.IncrementalTypeScript,
            oldProgram: oldProgram,
            newProgram: newProgram,
            options: options,
            incrementalBuildStrategy: incrementalBuildStrategy,
            newDriver: newDriver,
            typeCheckingProgramStrategy: typeCheckingProgramStrategy,
            enableTemplateTypeChecker: enableTemplateTypeChecker,
            usePoisonedData: usePoisonedData,
        };
    }
    exports.incrementalFromDriverTicket = incrementalFromDriverTicket;
    function resourceChangeTicket(compiler, modifiedResourceFiles) {
        return {
            kind: CompilationTicketKind.IncrementalResource,
            compiler: compiler,
            modifiedResourceFiles: modifiedResourceFiles,
        };
    }
    exports.resourceChangeTicket = resourceChangeTicket;
    /**
     * The heart of the Angular Ivy compiler.
     *
     * The `NgCompiler` provides an API for performing Angular compilation within a custom TypeScript
     * compiler. Each instance of `NgCompiler` supports a single compilation, which might be
     * incremental.
     *
     * `NgCompiler` is lazy, and does not perform any of the work of the compilation until one of its
     * output methods (e.g. `getDiagnostics`) is called.
     *
     * See the README.md for more information.
     */
    var NgCompiler = /** @class */ (function () {
        function NgCompiler(adapter, options, tsProgram, typeCheckingProgramStrategy, incrementalStrategy, incrementalDriver, enableTemplateTypeChecker, usePoisonedData, perfRecorder) {
            var _a;
            var _this = this;
            if (perfRecorder === void 0) { perfRecorder = perf_1.NOOP_PERF_RECORDER; }
            this.adapter = adapter;
            this.options = options;
            this.tsProgram = tsProgram;
            this.typeCheckingProgramStrategy = typeCheckingProgramStrategy;
            this.incrementalStrategy = incrementalStrategy;
            this.incrementalDriver = incrementalDriver;
            this.enableTemplateTypeChecker = enableTemplateTypeChecker;
            this.usePoisonedData = usePoisonedData;
            this.perfRecorder = perfRecorder;
            /**
             * Lazily evaluated state of the compilation.
             *
             * This is created on demand by calling `ensureAnalyzed`.
             */
            this.compilation = null;
            /**
             * Any diagnostics related to the construction of the compilation.
             *
             * These are diagnostics which arose during setup of the host and/or program.
             */
            this.constructionDiagnostics = [];
            /**
             * Non-template diagnostics related to the program itself. Does not include template
             * diagnostics because the template type checker memoizes them itself.
             *
             * This is set by (and memoizes) `getNonTemplateDiagnostics`.
             */
            this.nonTemplateDiagnostics = null;
            (_a = this.constructionDiagnostics).push.apply(_a, tslib_1.__spread(this.adapter.constructionDiagnostics));
            var incompatibleTypeCheckOptionsDiagnostic = verifyCompatibleTypeCheckOptions(this.options);
            if (incompatibleTypeCheckOptionsDiagnostic !== null) {
                this.constructionDiagnostics.push(incompatibleTypeCheckOptionsDiagnostic);
            }
            this.nextProgram = tsProgram;
            this.closureCompilerEnabled = !!this.options.annotateForClosureCompiler;
            this.entryPoint =
                adapter.entryPoint !== null ? typescript_1.getSourceFileOrNull(tsProgram, adapter.entryPoint) : null;
            var moduleResolutionCache = ts.createModuleResolutionCache(this.adapter.getCurrentDirectory(), 
            // Note: this used to be an arrow-function closure. However, JS engines like v8 have some
            // strange behaviors with retaining the lexical scope of the closure. Even if this function
            // doesn't retain a reference to `this`, if other closures in the constructor here reference
            // `this` internally then a closure created here would retain them. This can cause major
            // memory leak issues since the `moduleResolutionCache` is a long-lived object and finds its
            // way into all kinds of places inside TS internal objects.
            this.adapter.getCanonicalFileName.bind(this.adapter));
            this.moduleResolver =
                new imports_1.ModuleResolver(tsProgram, this.options, this.adapter, moduleResolutionCache);
            this.resourceManager = new resource_1.AdapterResourceLoader(adapter, this.options);
            this.cycleAnalyzer = new cycles_1.CycleAnalyzer(new cycles_1.ImportGraph(tsProgram.getTypeChecker()));
            this.incrementalStrategy.setIncrementalDriver(this.incrementalDriver, tsProgram);
            this.ignoreForDiagnostics =
                new Set(tsProgram.getSourceFiles().filter(function (sf) { return _this.adapter.isShim(sf); }));
            this.ignoreForEmit = this.adapter.ignoreForEmit;
        }
        /**
         * Convert a `CompilationTicket` into an `NgCompiler` instance for the requested compilation.
         *
         * Depending on the nature of the compilation request, the `NgCompiler` instance may be reused
         * from a previous compilation and updated with any changes, it may be a new instance which
         * incrementally reuses state from a previous compilation, or it may represent a fresh compilation
         * entirely.
         */
        NgCompiler.fromTicket = function (ticket, adapter, perfRecorder) {
            switch (ticket.kind) {
                case CompilationTicketKind.Fresh:
                    return new NgCompiler(adapter, ticket.options, ticket.tsProgram, ticket.typeCheckingProgramStrategy, ticket.incrementalBuildStrategy, incremental_1.IncrementalDriver.fresh(ticket.tsProgram), ticket.enableTemplateTypeChecker, ticket.usePoisonedData, perfRecorder);
                case CompilationTicketKind.IncrementalTypeScript:
                    return new NgCompiler(adapter, ticket.options, ticket.newProgram, ticket.typeCheckingProgramStrategy, ticket.incrementalBuildStrategy, ticket.newDriver, ticket.enableTemplateTypeChecker, ticket.usePoisonedData, perfRecorder);
                case CompilationTicketKind.IncrementalResource:
                    var compiler = ticket.compiler;
                    compiler.updateWithChangedResources(ticket.modifiedResourceFiles);
                    return compiler;
            }
        };
        NgCompiler.prototype.updateWithChangedResources = function (changedResources) {
            var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
            if (this.compilation === null) {
                // Analysis hasn't happened yet, so no update is necessary - any changes to resources will be
                // captured by the inital analysis pass itself.
                return;
            }
            this.resourceManager.invalidate();
            var classesToUpdate = new Set();
            try {
                for (var changedResources_1 = tslib_1.__values(changedResources), changedResources_1_1 = changedResources_1.next(); !changedResources_1_1.done; changedResources_1_1 = changedResources_1.next()) {
                    var resourceFile = changedResources_1_1.value;
                    try {
                        for (var _e = (e_2 = void 0, tslib_1.__values(this.getComponentsWithTemplateFile(resourceFile))), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var templateClass = _f.value;
                            classesToUpdate.add(templateClass);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    try {
                        for (var _g = (e_3 = void 0, tslib_1.__values(this.getComponentsWithStyleFile(resourceFile))), _h = _g.next(); !_h.done; _h = _g.next()) {
                            var styleClass = _h.value;
                            classesToUpdate.add(styleClass);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (changedResources_1_1 && !changedResources_1_1.done && (_a = changedResources_1.return)) _a.call(changedResources_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var classesToUpdate_1 = tslib_1.__values(classesToUpdate), classesToUpdate_1_1 = classesToUpdate_1.next(); !classesToUpdate_1_1.done; classesToUpdate_1_1 = classesToUpdate_1.next()) {
                    var clazz = classesToUpdate_1_1.value;
                    this.compilation.traitCompiler.updateResources(clazz);
                    if (!ts.isClassDeclaration(clazz)) {
                        continue;
                    }
                    this.compilation.templateTypeChecker.invalidateClass(clazz);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (classesToUpdate_1_1 && !classesToUpdate_1_1.done && (_d = classesToUpdate_1.return)) _d.call(classesToUpdate_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        /**
         * Get the resource dependencies of a file.
         *
         * If the file is not part of the compilation, an empty array will be returned.
         */
        NgCompiler.prototype.getResourceDependencies = function (file) {
            this.ensureAnalyzed();
            return this.incrementalDriver.depGraph.getResourceDependencies(file);
        };
        /**
         * Get all Angular-related diagnostics for this compilation.
         */
        NgCompiler.prototype.getDiagnostics = function () {
            return this.addMessageTextDetails(tslib_1.__spread(this.getNonTemplateDiagnostics(), this.getTemplateDiagnostics()));
        };
        /**
         * Get all Angular-related diagnostics for this compilation.
         *
         * If a `ts.SourceFile` is passed, only diagnostics related to that file are returned.
         */
        NgCompiler.prototype.getDiagnosticsForFile = function (file, optimizeFor) {
            return this.addMessageTextDetails(tslib_1.__spread(this.getNonTemplateDiagnostics().filter(function (diag) { return diag.file === file; }), this.getTemplateDiagnosticsForFile(file, optimizeFor)));
        };
        /**
         * Add Angular.io error guide links to diagnostics for this compilation.
         */
        NgCompiler.prototype.addMessageTextDetails = function (diagnostics) {
            return diagnostics.map(function (diag) {
                if (diag.code && diagnostics_1.COMPILER_ERRORS_WITH_GUIDES.has(diagnostics_1.ngErrorCode(diag.code))) {
                    return tslib_1.__assign(tslib_1.__assign({}, diag), { messageText: diag.messageText +
                            (". Find more at " + diagnostics_1.ERROR_DETAILS_PAGE_BASE_URL + "/NG" + diagnostics_1.ngErrorCode(diag.code)) });
                }
                return diag;
            });
        };
        /**
         * Get all setup-related diagnostics for this compilation.
         */
        NgCompiler.prototype.getOptionDiagnostics = function () {
            return this.constructionDiagnostics;
        };
        /**
         * Get the `ts.Program` to use as a starting point when spawning a subsequent incremental
         * compilation.
         *
         * The `NgCompiler` spawns an internal incremental TypeScript compilation (inheriting the
         * consumer's `ts.Program` into a new one for the purposes of template type-checking). After this
         * operation, the consumer's `ts.Program` is no longer usable for starting a new incremental
         * compilation. `getNextProgram` retrieves the `ts.Program` which can be used instead.
         */
        NgCompiler.prototype.getNextProgram = function () {
            return this.nextProgram;
        };
        NgCompiler.prototype.getTemplateTypeChecker = function () {
            if (!this.enableTemplateTypeChecker) {
                throw new Error('The `TemplateTypeChecker` does not work without `enableTemplateTypeChecker`.');
            }
            return this.ensureAnalyzed().templateTypeChecker;
        };
        /**
         * Retrieves the `ts.Declaration`s for any component(s) which use the given template file.
         */
        NgCompiler.prototype.getComponentsWithTemplateFile = function (templateFilePath) {
            var resourceRegistry = this.ensureAnalyzed().resourceRegistry;
            return resourceRegistry.getComponentsWithTemplate(file_system_1.resolve(templateFilePath));
        };
        /**
         * Retrieves the `ts.Declaration`s for any component(s) which use the given template file.
         */
        NgCompiler.prototype.getComponentsWithStyleFile = function (styleFilePath) {
            var resourceRegistry = this.ensureAnalyzed().resourceRegistry;
            return resourceRegistry.getComponentsWithStyle(file_system_1.resolve(styleFilePath));
        };
        /**
         * Retrieves external resources for the given component.
         */
        NgCompiler.prototype.getComponentResources = function (classDecl) {
            if (!reflection_1.isNamedClassDeclaration(classDecl)) {
                return null;
            }
            var resourceRegistry = this.ensureAnalyzed().resourceRegistry;
            var styles = resourceRegistry.getStyles(classDecl);
            var template = resourceRegistry.getTemplate(classDecl);
            if (template === null) {
                return null;
            }
            return { styles: styles, template: template };
        };
        /**
         * Perform Angular's analysis step (as a precursor to `getDiagnostics` or `prepareEmit`)
         * asynchronously.
         *
         * Normally, this operation happens lazily whenever `getDiagnostics` or `prepareEmit` are called.
         * However, certain consumers may wish to allow for an asynchronous phase of analysis, where
         * resources such as `styleUrls` are resolved asynchonously. In these cases `analyzeAsync` must be
         * called first, and its `Promise` awaited prior to calling any other APIs of `NgCompiler`.
         */
        NgCompiler.prototype.analyzeAsync = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var analyzeSpan, promises, _loop_1, this_1, _a, _b, sf;
                var e_5, _c;
                var _this = this;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (this.compilation !== null) {
                                return [2 /*return*/];
                            }
                            this.compilation = this.makeCompilation();
                            analyzeSpan = this.perfRecorder.start('analyze');
                            promises = [];
                            _loop_1 = function (sf) {
                                if (sf.isDeclarationFile) {
                                    return "continue";
                                }
                                var analyzeFileSpan = this_1.perfRecorder.start('analyzeFile', sf);
                                var analysisPromise = this_1.compilation.traitCompiler.analyzeAsync(sf);
                                this_1.scanForMwp(sf);
                                if (analysisPromise === undefined) {
                                    this_1.perfRecorder.stop(analyzeFileSpan);
                                }
                                else if (this_1.perfRecorder.enabled) {
                                    analysisPromise = analysisPromise.then(function () { return _this.perfRecorder.stop(analyzeFileSpan); });
                                }
                                if (analysisPromise !== undefined) {
                                    promises.push(analysisPromise);
                                }
                            };
                            this_1 = this;
                            try {
                                for (_a = tslib_1.__values(this.tsProgram.getSourceFiles()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    sf = _b.value;
                                    _loop_1(sf);
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _d.sent();
                            this.perfRecorder.stop(analyzeSpan);
                            this.resolveCompilation(this.compilation.traitCompiler);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * List lazy routes detected during analysis.
         *
         * This can be called for one specific route, or to retrieve all top-level routes.
         */
        NgCompiler.prototype.listLazyRoutes = function (entryRoute) {
            if (entryRoute) {
                // Note:
                // This resolution step is here to match the implementation of the old `AotCompilerHost` (see
                // https://github.com/angular/angular/blob/50732e156/packages/compiler-cli/src/transformers/compiler_host.ts#L175-L188).
                //
                // `@angular/cli` will always call this API with an absolute path, so the resolution step is
                // not necessary, but keeping it backwards compatible in case someone else is using the API.
                // Relative entry paths are disallowed.
                if (entryRoute.startsWith('.')) {
                    throw new Error("Failed to list lazy routes: Resolution of relative paths (" + entryRoute + ") is not supported.");
                }
                // Non-relative entry paths fall into one of the following categories:
                // - Absolute system paths (e.g. `/foo/bar/my-project/my-module`), which are unaffected by the
                //   logic below.
                // - Paths to enternal modules (e.g. `some-lib`).
                // - Paths mapped to directories in `tsconfig.json` (e.g. `shared/my-module`).
                //   (See https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping.)
                //
                // In all cases above, the `containingFile` argument is ignored, so we can just take the first
                // of the root files.
                var containingFile = this.tsProgram.getRootFileNames()[0];
                var _a = tslib_1.__read(entryRoute.split('#'), 2), entryPath = _a[0], moduleName = _a[1];
                var resolvedModule = typescript_1.resolveModuleName(entryPath, containingFile, this.options, this.adapter, null);
                if (resolvedModule) {
                    entryRoute = routing_1.entryPointKeyFor(resolvedModule.resolvedFileName, moduleName);
                }
            }
            var compilation = this.ensureAnalyzed();
            return compilation.routeAnalyzer.listLazyRoutes(entryRoute);
        };
        /**
         * Fetch transformers and other information which is necessary for a consumer to `emit` the
         * program with Angular-added definitions.
         */
        NgCompiler.prototype.prepareEmit = function () {
            var compilation = this.ensureAnalyzed();
            var coreImportsFrom = compilation.isCore ? getR3SymbolsFile(this.tsProgram) : null;
            var importRewriter;
            if (coreImportsFrom !== null) {
                importRewriter = new imports_1.R3SymbolsImportRewriter(coreImportsFrom.fileName);
            }
            else {
                importRewriter = new imports_1.NoopImportRewriter();
            }
            var before = [
                transform_1.ivyTransformFactory(compilation.traitCompiler, compilation.reflector, importRewriter, compilation.defaultImportTracker, compilation.isCore, this.closureCompilerEnabled),
                transform_1.aliasTransformFactory(compilation.traitCompiler.exportStatements),
                compilation.defaultImportTracker.importPreservingTransformer(),
            ];
            var afterDeclarations = [];
            if (compilation.dtsTransforms !== null) {
                afterDeclarations.push(transform_1.declarationTransformFactory(compilation.dtsTransforms, importRewriter));
            }
            // Only add aliasing re-exports to the .d.ts output if the `AliasingHost` requests it.
            if (compilation.aliasingHost !== null && compilation.aliasingHost.aliasExportsInDts) {
                afterDeclarations.push(transform_1.aliasTransformFactory(compilation.traitCompiler.exportStatements));
            }
            if (this.adapter.factoryTracker !== null) {
                before.push(shims_1.generatedFactoryTransform(this.adapter.factoryTracker.sourceInfo, importRewriter));
            }
            before.push(switch_1.ivySwitchTransform);
            return { transformers: { before: before, afterDeclarations: afterDeclarations } };
        };
        /**
         * Run the indexing process and return a `Map` of all indexed components.
         *
         * See the `indexing` package for more details.
         */
        NgCompiler.prototype.getIndexedComponents = function () {
            var compilation = this.ensureAnalyzed();
            var context = new indexer_1.IndexingContext();
            compilation.traitCompiler.index(context);
            return indexer_1.generateAnalysis(context);
        };
        NgCompiler.prototype.ensureAnalyzed = function () {
            if (this.compilation === null) {
                this.analyzeSync();
            }
            return this.compilation;
        };
        NgCompiler.prototype.analyzeSync = function () {
            var e_6, _a;
            var analyzeSpan = this.perfRecorder.start('analyze');
            this.compilation = this.makeCompilation();
            try {
                for (var _b = tslib_1.__values(this.tsProgram.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var sf = _c.value;
                    if (sf.isDeclarationFile) {
                        continue;
                    }
                    var analyzeFileSpan = this.perfRecorder.start('analyzeFile', sf);
                    this.compilation.traitCompiler.analyzeSync(sf);
                    this.scanForMwp(sf);
                    this.perfRecorder.stop(analyzeFileSpan);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
            this.perfRecorder.stop(analyzeSpan);
            this.resolveCompilation(this.compilation.traitCompiler);
        };
        NgCompiler.prototype.resolveCompilation = function (traitCompiler) {
            traitCompiler.resolve();
            // At this point, analysis is complete and the compiler can now calculate which files need to
            // be emitted, so do that.
            this.incrementalDriver.recordSuccessfulAnalysis(traitCompiler);
        };
        Object.defineProperty(NgCompiler.prototype, "fullTemplateTypeCheck", {
            get: function () {
                // Determine the strictness level of type checking based on compiler options. As
                // `strictTemplates` is a superset of `fullTemplateTypeCheck`, the former implies the latter.
                // Also see `verifyCompatibleTypeCheckOptions` where it is verified that `fullTemplateTypeCheck`
                // is not disabled when `strictTemplates` is enabled.
                var strictTemplates = !!this.options.strictTemplates;
                return strictTemplates || !!this.options.fullTemplateTypeCheck;
            },
            enumerable: false,
            configurable: true
        });
        NgCompiler.prototype.getTypeCheckingConfig = function () {
            // Determine the strictness level of type checking based on compiler options. As
            // `strictTemplates` is a superset of `fullTemplateTypeCheck`, the former implies the latter.
            // Also see `verifyCompatibleTypeCheckOptions` where it is verified that `fullTemplateTypeCheck`
            // is not disabled when `strictTemplates` is enabled.
            var strictTemplates = !!this.options.strictTemplates;
            // First select a type-checking configuration, based on whether full template type-checking is
            // requested.
            var typeCheckingConfig;
            if (this.fullTemplateTypeCheck) {
                typeCheckingConfig = {
                    applyTemplateContextGuards: strictTemplates,
                    checkQueries: false,
                    checkTemplateBodies: true,
                    alwaysCheckSchemaInTemplateBodies: true,
                    checkTypeOfInputBindings: strictTemplates,
                    honorAccessModifiersForInputBindings: false,
                    strictNullInputBindings: strictTemplates,
                    checkTypeOfAttributes: strictTemplates,
                    // Even in full template type-checking mode, DOM binding checks are not quite ready yet.
                    checkTypeOfDomBindings: false,
                    checkTypeOfOutputEvents: strictTemplates,
                    checkTypeOfAnimationEvents: strictTemplates,
                    // Checking of DOM events currently has an adverse effect on developer experience,
                    // e.g. for `<input (blur)="update($event.target.value)">` enabling this check results in:
                    // - error TS2531: Object is possibly 'null'.
                    // - error TS2339: Property 'value' does not exist on type 'EventTarget'.
                    checkTypeOfDomEvents: strictTemplates,
                    checkTypeOfDomReferences: strictTemplates,
                    // Non-DOM references have the correct type in View Engine so there is no strictness flag.
                    checkTypeOfNonDomReferences: true,
                    // Pipes are checked in View Engine so there is no strictness flag.
                    checkTypeOfPipes: true,
                    strictSafeNavigationTypes: strictTemplates,
                    useContextGenericType: strictTemplates,
                    strictLiteralTypes: true,
                    enableTemplateTypeChecker: this.enableTemplateTypeChecker,
                };
            }
            else {
                typeCheckingConfig = {
                    applyTemplateContextGuards: false,
                    checkQueries: false,
                    checkTemplateBodies: false,
                    // Enable deep schema checking in "basic" template type-checking mode only if Closure
                    // compilation is requested, which is a good proxy for "only in google3".
                    alwaysCheckSchemaInTemplateBodies: this.closureCompilerEnabled,
                    checkTypeOfInputBindings: false,
                    strictNullInputBindings: false,
                    honorAccessModifiersForInputBindings: false,
                    checkTypeOfAttributes: false,
                    checkTypeOfDomBindings: false,
                    checkTypeOfOutputEvents: false,
                    checkTypeOfAnimationEvents: false,
                    checkTypeOfDomEvents: false,
                    checkTypeOfDomReferences: false,
                    checkTypeOfNonDomReferences: false,
                    checkTypeOfPipes: false,
                    strictSafeNavigationTypes: false,
                    useContextGenericType: false,
                    strictLiteralTypes: false,
                    enableTemplateTypeChecker: this.enableTemplateTypeChecker,
                };
            }
            // Apply explicitly configured strictness flags on top of the default configuration
            // based on "fullTemplateTypeCheck".
            if (this.options.strictInputTypes !== undefined) {
                typeCheckingConfig.checkTypeOfInputBindings = this.options.strictInputTypes;
                typeCheckingConfig.applyTemplateContextGuards = this.options.strictInputTypes;
            }
            if (this.options.strictInputAccessModifiers !== undefined) {
                typeCheckingConfig.honorAccessModifiersForInputBindings =
                    this.options.strictInputAccessModifiers;
            }
            if (this.options.strictNullInputTypes !== undefined) {
                typeCheckingConfig.strictNullInputBindings = this.options.strictNullInputTypes;
            }
            if (this.options.strictOutputEventTypes !== undefined) {
                typeCheckingConfig.checkTypeOfOutputEvents = this.options.strictOutputEventTypes;
                typeCheckingConfig.checkTypeOfAnimationEvents = this.options.strictOutputEventTypes;
            }
            if (this.options.strictDomEventTypes !== undefined) {
                typeCheckingConfig.checkTypeOfDomEvents = this.options.strictDomEventTypes;
            }
            if (this.options.strictSafeNavigationTypes !== undefined) {
                typeCheckingConfig.strictSafeNavigationTypes = this.options.strictSafeNavigationTypes;
            }
            if (this.options.strictDomLocalRefTypes !== undefined) {
                typeCheckingConfig.checkTypeOfDomReferences = this.options.strictDomLocalRefTypes;
            }
            if (this.options.strictAttributeTypes !== undefined) {
                typeCheckingConfig.checkTypeOfAttributes = this.options.strictAttributeTypes;
            }
            if (this.options.strictContextGenerics !== undefined) {
                typeCheckingConfig.useContextGenericType = this.options.strictContextGenerics;
            }
            if (this.options.strictLiteralTypes !== undefined) {
                typeCheckingConfig.strictLiteralTypes = this.options.strictLiteralTypes;
            }
            return typeCheckingConfig;
        };
        NgCompiler.prototype.getTemplateDiagnostics = function () {
            var e_7, _a;
            var compilation = this.ensureAnalyzed();
            // Get the diagnostics.
            var typeCheckSpan = this.perfRecorder.start('typeCheckDiagnostics');
            var diagnostics = [];
            try {
                for (var _b = tslib_1.__values(this.tsProgram.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var sf = _c.value;
                    if (sf.isDeclarationFile || this.adapter.isShim(sf)) {
                        continue;
                    }
                    diagnostics.push.apply(diagnostics, tslib_1.__spread(compilation.templateTypeChecker.getDiagnosticsForFile(sf, api_1.OptimizeFor.WholeProgram)));
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
            var program = this.typeCheckingProgramStrategy.getProgram();
            this.perfRecorder.stop(typeCheckSpan);
            this.incrementalStrategy.setIncrementalDriver(this.incrementalDriver, program);
            this.nextProgram = program;
            return diagnostics;
        };
        NgCompiler.prototype.getTemplateDiagnosticsForFile = function (sf, optimizeFor) {
            var compilation = this.ensureAnalyzed();
            // Get the diagnostics.
            var typeCheckSpan = this.perfRecorder.start('typeCheckDiagnostics');
            var diagnostics = [];
            if (!sf.isDeclarationFile && !this.adapter.isShim(sf)) {
                diagnostics.push.apply(diagnostics, tslib_1.__spread(compilation.templateTypeChecker.getDiagnosticsForFile(sf, optimizeFor)));
            }
            var program = this.typeCheckingProgramStrategy.getProgram();
            this.perfRecorder.stop(typeCheckSpan);
            this.incrementalStrategy.setIncrementalDriver(this.incrementalDriver, program);
            this.nextProgram = program;
            return diagnostics;
        };
        NgCompiler.prototype.getNonTemplateDiagnostics = function () {
            var _a;
            if (this.nonTemplateDiagnostics === null) {
                var compilation = this.ensureAnalyzed();
                this.nonTemplateDiagnostics = tslib_1.__spread(compilation.traitCompiler.diagnostics);
                if (this.entryPoint !== null && compilation.exportReferenceGraph !== null) {
                    (_a = this.nonTemplateDiagnostics).push.apply(_a, tslib_1.__spread(entry_point_1.checkForPrivateExports(this.entryPoint, this.tsProgram.getTypeChecker(), compilation.exportReferenceGraph)));
                }
            }
            return this.nonTemplateDiagnostics;
        };
        NgCompiler.prototype.scanForMwp = function (sf) {
            var _this = this;
            this.compilation.mwpScanner.scan(sf, {
                addTypeReplacement: function (node, type) {
                    // Only obtain the return type transform for the source file once there's a type to replace,
                    // so that no transform is allocated when there's nothing to do.
                    _this.compilation.dtsTransforms.getReturnTypeTransform(sf).addTypeReplacement(node, type);
                }
            });
        };
        NgCompiler.prototype.makeCompilation = function () {
            var checker = this.tsProgram.getTypeChecker();
            var reflector = new reflection_1.TypeScriptReflectionHost(checker);
            // Construct the ReferenceEmitter.
            var refEmitter;
            var aliasingHost = null;
            if (this.adapter.unifiedModulesHost === null || !this.options._useHostForImportGeneration) {
                var localImportStrategy = void 0;
                // The strategy used for local, in-project imports depends on whether TS has been configured
                // with rootDirs. If so, then multiple directories may be mapped in the same "module
                // namespace" and the logic of `LogicalProjectStrategy` is required to generate correct
                // imports which may cross these multiple directories. Otherwise, plain relative imports are
                // sufficient.
                if (this.options.rootDir !== undefined ||
                    (this.options.rootDirs !== undefined && this.options.rootDirs.length > 0)) {
                    // rootDirs logic is in effect - use the `LogicalProjectStrategy` for in-project relative
                    // imports.
                    localImportStrategy = new imports_1.LogicalProjectStrategy(reflector, new file_system_1.LogicalFileSystem(tslib_1.__spread(this.adapter.rootDirs), this.adapter));
                }
                else {
                    // Plain relative imports are all that's needed.
                    localImportStrategy = new imports_1.RelativePathStrategy(reflector);
                }
                // The CompilerHost doesn't have fileNameToModuleName, so build an NPM-centric reference
                // resolution strategy.
                refEmitter = new imports_1.ReferenceEmitter([
                    // First, try to use local identifiers if available.
                    new imports_1.LocalIdentifierStrategy(),
                    // Next, attempt to use an absolute import.
                    new imports_1.AbsoluteModuleStrategy(this.tsProgram, checker, this.moduleResolver, reflector),
                    // Finally, check if the reference is being written into a file within the project's .ts
                    // sources, and use a relative import if so. If this fails, ReferenceEmitter will throw
                    // an error.
                    localImportStrategy,
                ]);
                // If an entrypoint is present, then all user imports should be directed through the
                // entrypoint and private exports are not needed. The compiler will validate that all publicly
                // visible directives/pipes are importable via this entrypoint.
                if (this.entryPoint === null && this.options.generateDeepReexports === true) {
                    // No entrypoint is present and deep re-exports were requested, so configure the aliasing
                    // system to generate them.
                    aliasingHost = new imports_1.PrivateExportAliasingHost(reflector);
                }
            }
            else {
                // The CompilerHost supports fileNameToModuleName, so use that to emit imports.
                refEmitter = new imports_1.ReferenceEmitter([
                    // First, try to use local identifiers if available.
                    new imports_1.LocalIdentifierStrategy(),
                    // Then use aliased references (this is a workaround to StrictDeps checks).
                    new imports_1.AliasStrategy(),
                    // Then use fileNameToModuleName to emit imports.
                    new imports_1.UnifiedModulesStrategy(reflector, this.adapter.unifiedModulesHost),
                ]);
                aliasingHost = new imports_1.UnifiedModulesAliasingHost(this.adapter.unifiedModulesHost);
            }
            var evaluator = new partial_evaluator_1.PartialEvaluator(reflector, checker, this.incrementalDriver.depGraph);
            var dtsReader = new metadata_1.DtsMetadataReader(checker, reflector);
            var localMetaRegistry = new metadata_1.LocalMetadataRegistry();
            var localMetaReader = localMetaRegistry;
            var depScopeReader = new scope_1.MetadataDtsModuleScopeResolver(dtsReader, aliasingHost);
            var scopeRegistry = new scope_1.LocalModuleScopeRegistry(localMetaReader, depScopeReader, refEmitter, aliasingHost);
            var scopeReader = scopeRegistry;
            var semanticDepGraphUpdater = this.incrementalDriver.getSemanticDepGraphUpdater();
            var metaRegistry = new metadata_1.CompoundMetadataRegistry([localMetaRegistry, scopeRegistry]);
            var injectableRegistry = new metadata_1.InjectableClassRegistry(reflector);
            var metaReader = new metadata_1.CompoundMetadataReader([localMetaReader, dtsReader]);
            var typeCheckScopeRegistry = new scope_1.TypeCheckScopeRegistry(scopeReader, metaReader);
            // If a flat module entrypoint was specified, then track references via a `ReferenceGraph` in
            // order to produce proper diagnostics for incorrectly exported directives/pipes/etc. If there
            // is no flat module entrypoint then don't pay the cost of tracking references.
            var referencesRegistry;
            var exportReferenceGraph = null;
            if (this.entryPoint !== null) {
                exportReferenceGraph = new entry_point_1.ReferenceGraph();
                referencesRegistry = new ReferenceGraphAdapter(exportReferenceGraph);
            }
            else {
                referencesRegistry = new annotations_1.NoopReferencesRegistry();
            }
            var routeAnalyzer = new routing_1.NgModuleRouteAnalyzer(this.moduleResolver, evaluator);
            var dtsTransforms = new transform_1.DtsTransformRegistry();
            var mwpScanner = new modulewithproviders_1.ModuleWithProvidersScanner(reflector, evaluator, refEmitter);
            var isCore = isAngularCorePackage(this.tsProgram);
            var defaultImportTracker = new imports_1.DefaultImportTracker();
            var resourceRegistry = new metadata_1.ResourceRegistry();
            var compilationMode = this.options.compilationMode === 'partial' ? transform_1.CompilationMode.PARTIAL : transform_1.CompilationMode.FULL;
            // Cycles are handled in full compilation mode by "remote scoping".
            // "Remote scoping" does not work well with tree shaking for libraries.
            // So in partial compilation mode, when building a library, a cycle will cause an error.
            var cycleHandlingStrategy = compilationMode === transform_1.CompilationMode.FULL ?
                0 /* UseRemoteScoping */ :
                1 /* Error */;
            // Set up the IvyCompilation, which manages state for the Ivy transformer.
            var handlers = [
                new annotations_1.ComponentDecoratorHandler(reflector, evaluator, metaRegistry, metaReader, scopeReader, scopeRegistry, typeCheckScopeRegistry, resourceRegistry, isCore, this.resourceManager, this.adapter.rootDirs, this.options.preserveWhitespaces || false, this.options.i18nUseExternalIds !== false, this.options.enableI18nLegacyMessageIdFormat !== false, this.usePoisonedData, this.options.i18nNormalizeLineEndingsInICUs, this.moduleResolver, this.cycleAnalyzer, cycleHandlingStrategy, refEmitter, defaultImportTracker, this.incrementalDriver.depGraph, injectableRegistry, semanticDepGraphUpdater, this.closureCompilerEnabled),
                // TODO(alxhub): understand why the cast here is necessary (something to do with `null`
                // not being assignable to `unknown` when wrapped in `Readonly`).
                // clang-format off
                new annotations_1.DirectiveDecoratorHandler(reflector, evaluator, metaRegistry, scopeRegistry, metaReader, defaultImportTracker, injectableRegistry, isCore, semanticDepGraphUpdater, this.closureCompilerEnabled, config_1.compileUndecoratedClassesWithAngularFeatures),
                // clang-format on
                // Pipe handler must be before injectable handler in list so pipe factories are printed
                // before injectable factories (so injectable factories can delegate to them)
                new annotations_1.PipeDecoratorHandler(reflector, evaluator, metaRegistry, scopeRegistry, defaultImportTracker, injectableRegistry, isCore),
                new annotations_1.InjectableDecoratorHandler(reflector, defaultImportTracker, isCore, this.options.strictInjectionParameters || false, injectableRegistry),
                new annotations_1.NgModuleDecoratorHandler(reflector, evaluator, metaReader, metaRegistry, scopeRegistry, referencesRegistry, isCore, routeAnalyzer, refEmitter, this.adapter.factoryTracker, defaultImportTracker, this.closureCompilerEnabled, injectableRegistry, this.options.i18nInLocale),
            ];
            var traitCompiler = new transform_1.TraitCompiler(handlers, reflector, this.perfRecorder, this.incrementalDriver, this.options.compileNonExportedClasses !== false, compilationMode, dtsTransforms, semanticDepGraphUpdater);
            var templateTypeChecker = new typecheck_1.TemplateTypeCheckerImpl(this.tsProgram, this.typeCheckingProgramStrategy, traitCompiler, this.getTypeCheckingConfig(), refEmitter, reflector, this.adapter, this.incrementalDriver, scopeRegistry, typeCheckScopeRegistry);
            return {
                isCore: isCore,
                traitCompiler: traitCompiler,
                reflector: reflector,
                scopeRegistry: scopeRegistry,
                dtsTransforms: dtsTransforms,
                exportReferenceGraph: exportReferenceGraph,
                routeAnalyzer: routeAnalyzer,
                mwpScanner: mwpScanner,
                metaReader: metaReader,
                typeCheckScopeRegistry: typeCheckScopeRegistry,
                defaultImportTracker: defaultImportTracker,
                aliasingHost: aliasingHost,
                refEmitter: refEmitter,
                templateTypeChecker: templateTypeChecker,
                resourceRegistry: resourceRegistry,
            };
        };
        return NgCompiler;
    }());
    exports.NgCompiler = NgCompiler;
    /**
     * Determine if the given `Program` is @angular/core.
     */
    function isAngularCorePackage(program) {
        // Look for its_just_angular.ts somewhere in the program.
        var r3Symbols = getR3SymbolsFile(program);
        if (r3Symbols === null) {
            return false;
        }
        // Look for the constant ITS_JUST_ANGULAR in that file.
        return r3Symbols.statements.some(function (stmt) {
            // The statement must be a variable declaration statement.
            if (!ts.isVariableStatement(stmt)) {
                return false;
            }
            // It must be exported.
            if (stmt.modifiers === undefined ||
                !stmt.modifiers.some(function (mod) { return mod.kind === ts.SyntaxKind.ExportKeyword; })) {
                return false;
            }
            // It must declare ITS_JUST_ANGULAR.
            return stmt.declarationList.declarations.some(function (decl) {
                // The declaration must match the name.
                if (!ts.isIdentifier(decl.name) || decl.name.text !== 'ITS_JUST_ANGULAR') {
                    return false;
                }
                // It must initialize the variable to true.
                if (decl.initializer === undefined || decl.initializer.kind !== ts.SyntaxKind.TrueKeyword) {
                    return false;
                }
                // This definition matches.
                return true;
            });
        });
    }
    exports.isAngularCorePackage = isAngularCorePackage;
    /**
     * Find the 'r3_symbols.ts' file in the given `Program`, or return `null` if it wasn't there.
     */
    function getR3SymbolsFile(program) {
        return program.getSourceFiles().find(function (file) { return file.fileName.indexOf('r3_symbols.ts') >= 0; }) || null;
    }
    /**
     * Since "strictTemplates" is a true superset of type checking capabilities compared to
     * "fullTemplateTypeCheck", it is required that the latter is not explicitly disabled if the
     * former is enabled.
     */
    function verifyCompatibleTypeCheckOptions(options) {
        if (options.fullTemplateTypeCheck === false && options.strictTemplates === true) {
            return {
                category: ts.DiagnosticCategory.Error,
                code: diagnostics_1.ngErrorCode(diagnostics_1.ErrorCode.CONFIG_STRICT_TEMPLATES_IMPLIES_FULL_TEMPLATE_TYPECHECK),
                file: undefined,
                start: undefined,
                length: undefined,
                messageText: "Angular compiler option \"strictTemplates\" is enabled, however \"fullTemplateTypeCheck\" is disabled.\n\nHaving the \"strictTemplates\" flag enabled implies that \"fullTemplateTypeCheck\" is also enabled, so\nthe latter can not be explicitly disabled.\n\nOne of the following actions is required:\n1. Remove the \"fullTemplateTypeCheck\" option.\n2. Remove \"strictTemplates\" or set it to 'false'.\n\nMore information about the template type checking compiler options can be found in the documentation:\nhttps://v9.angular.io/guide/template-typecheck#template-type-checking",
            };
        }
        return null;
    }
    var ReferenceGraphAdapter = /** @class */ (function () {
        function ReferenceGraphAdapter(graph) {
            this.graph = graph;
        }
        ReferenceGraphAdapter.prototype.add = function (source) {
            var e_8, _a;
            var references = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                references[_i - 1] = arguments[_i];
            }
            try {
                for (var references_1 = tslib_1.__values(references), references_1_1 = references_1.next(); !references_1_1.done; references_1_1 = references_1.next()) {
                    var node = references_1_1.value.node;
                    var sourceFile = node.getSourceFile();
                    if (sourceFile === undefined) {
                        sourceFile = ts.getOriginalNode(node).getSourceFile();
                    }
                    // Only record local references (not references into .d.ts files).
                    if (sourceFile === undefined || !typescript_1.isDtsPath(sourceFile.fileName)) {
                        this.graph.add(source, node);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (references_1_1 && !references_1_1.done && (_a = references_1.return)) _a.call(references_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
        };
        return ReferenceGraphAdapter;
    }());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2NvcmUvc3JjL2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFHSCwrQkFBaUM7SUFFakMsMkVBQStNO0lBQy9NLGlFQUErRTtJQUMvRSwyRUFBbUg7SUFDbkgsMkVBQXlFO0lBQ3pFLDJFQUE2RDtJQUM3RCxtRUFBK1g7SUFDL1gsMkVBQThFO0lBRTlFLG1FQUFrRjtJQUNsRixxRUFBeU07SUFDek0sMkZBQXFFO0lBQ3JFLHVGQUF5RDtJQUN6RCw2REFBNEQ7SUFDNUQseUVBQW9HO0lBQ3BHLHFFQUFxRDtJQUNyRCxtRUFBc0U7SUFDdEUsK0RBQW1JO0lBQ25JLCtEQUFzRDtJQUN0RCxpRUFBZ0Q7SUFDaEQsdUVBQWdMO0lBQ2hMLHVFQUF3RDtJQUN4RCxxRUFBc0g7SUFDdEgsa0ZBQTRGO0lBRzVGLDBFQUFzRTtJQTBCdEU7O09BRUc7SUFDSCxJQUFZLHFCQUlYO0lBSkQsV0FBWSxxQkFBcUI7UUFDL0IsbUVBQUssQ0FBQTtRQUNMLG1HQUFxQixDQUFBO1FBQ3JCLCtGQUFtQixDQUFBO0lBQ3JCLENBQUMsRUFKVyxxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQUloQztJQThDRDs7T0FFRztJQUNILFNBQWdCLHNCQUFzQixDQUNsQyxTQUFxQixFQUFFLE9BQTBCLEVBQ2pELHdCQUFrRCxFQUNsRCwyQkFBd0QsRUFBRSx5QkFBa0MsRUFDNUYsZUFBd0I7UUFDMUIsT0FBTztZQUNMLElBQUksRUFBRSxxQkFBcUIsQ0FBQyxLQUFLO1lBQ2pDLFNBQVMsV0FBQTtZQUNULE9BQU8sU0FBQTtZQUNQLHdCQUF3QiwwQkFBQTtZQUN4QiwyQkFBMkIsNkJBQUE7WUFDM0IseUJBQXlCLDJCQUFBO1lBQ3pCLGVB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RUFBa0U7b0JBQ2xFLElBQUksVUFBVSxLQUFLLFNBQVMsSUFBSSxDQUFDLHNCQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUMvRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQzlCO2lCQUNGOzs7Ozs7Ozs7UUFDSCxDQUFDO1FBQ0gsNEJBQUM7SUFBRCxDQUFDLEFBaEJELElBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VHlwZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Q29tcG9uZW50RGVjb3JhdG9ySGFuZGxlciwgRGlyZWN0aXZlRGVjb3JhdG9ySGFuZGxlciwgSW5qZWN0YWJsZURlY29yYXRvckhhbmRsZXIsIE5nTW9kdWxlRGVjb3JhdG9ySGFuZGxlciwgTm9vcFJlZmVyZW5jZXNSZWdpc3RyeSwgUGlwZURlY29yYXRvckhhbmRsZXIsIFJlZmVyZW5jZXNSZWdpc3RyeX0gZnJvbSAnLi4vLi4vYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHtDeWNsZUFuYWx5emVyLCBDeWNsZUhhbmRsaW5nU3RyYXRlZ3ksIEltcG9ydEdyYXBofSBmcm9tICcuLi8uLi9jeWNsZXMnO1xuaW1wb3J0IHtDT01QSUxFUl9FUlJPUlNfV0lUSF9HVUlERVMsIEVSUk9SX0RFVEFJTFNfUEFHRV9CQVNFX1VSTCwgRXJyb3JDb2RlLCBuZ0Vycm9yQ29kZX0gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtjaGVja0ZvclByaXZhdGVFeHBvcnRzLCBSZWZlcmVuY2VHcmFwaH0gZnJvbSAnLi4vLi4vZW50cnlfcG9pbnQnO1xuaW1wb3J0IHtMb2dpY2FsRmlsZVN5c3RlbSwgcmVzb2x2ZX0gZnJvbSAnLi4vLi4vZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtBYnNvbHV0ZU1vZHVsZVN0cmF0ZWd5LCBBbGlhc2luZ0hvc3QsIEFsaWFzU3RyYXRlZ3ksIERlZmF1bHRJbXBvcnRUcmFja2VyLCBJbXBvcnRSZXdyaXRlciwgTG9jYWxJZGVudGlmaWVyU3RyYXRlZ3ksIExvZ2ljYWxQcm9qZWN0U3RyYXRlZ3ksIE1vZHVsZVJlc29sdmVyLCBOb29wSW1wb3J0UmV3cml0ZXIsIFByaXZhdGVFeHBvcnRBbGlhc2luZ0hvc3QsIFIzU3ltYm9sc0ltcG9ydFJld3JpdGVyLCBSZWZlcmVuY2UsIFJlZmVyZW5jZUVtaXRTdHJhdGVneSwgUmVmZXJlbmNlRW1pdHRlciwgUmVsYXRpdmVQYXRoU3RyYXRlZ3ksIFVuaWZpZWRNb2R1bGVzQWxpYXNpbmdIb3N0LCBVbmlmaWVkTW9kdWxlc1N0cmF0ZWd5fSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7SW5jcmVtZW50YWxCdWlsZFN0cmF0ZWd5LCBJbmNyZW1lbnRhbERyaXZlcn0gZnJvbSAnLi4vLi4vaW5jcmVtZW50YWwnO1xuaW1wb3J0IHtTZW1hbnRpY1N5bWJvbH0gZnJvbSAnLi4vLi4vaW5jcmVtZW50YWwvc2VtYW50aWNfZ3JhcGgnO1xuaW1wb3J0IHtnZW5lcmF0ZUFuYWx5c2lzLCBJbmRleGVkQ29tcG9uZW50LCBJbmRleGluZ0NvbnRleHR9IGZyb20gJy4uLy4uL2luZGV4ZXInO1xuaW1wb3J0IHtDb21wb25lbnRSZXNvdXJjZXMsIENvbXBvdW5kTWV0YWRhdGFSZWFkZXIsIENvbXBvdW5kTWV0YWRhdGFSZWdpc3RyeSwgRHRzTWV0YWRhdGFSZWFkZXIsIEluamVjdGFibGVDbGFzc1JlZ2lzdHJ5LCBMb2NhbE1ldGFkYXRhUmVnaXN0cnksIE1ldGFkYXRhUmVhZGVyLCBSZXNvdXJjZVJlZ2lzdHJ5fSBmcm9tICcuLi8uLi9tZXRhZGF0YSc7XG5pbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnNTY2FubmVyfSBmcm9tICcuLi8uLi9tb2R1bGV3aXRocHJvdmlkZXJzJztcbmltcG9ydCB7UGFydGlhbEV2YWx1YXRvcn0gZnJvbSAnLi4vLi4vcGFydGlhbF9ldmFsdWF0b3InO1xuaW1wb3J0IHtOT09QX1BFUkZfUkVDT1JERVIsIFBlcmZSZWNvcmRlcn0gZnJvbSAnLi4vLi4vcGVyZic7XG5pbXBvcnQge0RlY2xhcmF0aW9uTm9kZSwgaXNOYW1lZENsYXNzRGVjbGFyYXRpb24sIFR5cGVTY3JpcHRSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge0FkYXB0ZXJSZXNvdXJjZUxvYWRlcn0gZnJvbSAnLi4vLi4vcmVzb3VyY2UnO1xuaW1wb3J0IHtlbnRyeVBvaW50S2V5Rm9yLCBOZ01vZHVsZVJvdXRlQW5hbHl6ZXJ9IGZyb20gJy4uLy4uL3JvdXRpbmcnO1xuaW1wb3J0IHtDb21wb25lbnRTY29wZVJlYWRlciwgTG9jYWxNb2R1bGVTY29wZVJlZ2lzdHJ5LCBNZXRhZGF0YUR0c01vZHVsZVNjb3BlUmVzb2x2ZXIsIFR5cGVDaGVja1Njb3BlUmVnaXN0cnl9IGZyb20gJy4uLy4uL3Njb3BlJztcbmltcG9ydCB7Z2VuZXJhdGVkRmFjdG9yeVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vc2hpbXMnO1xuaW1wb3J0IHtpdnlTd2l0Y2hUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3N3aXRjaCc7XG5pbXBvcnQge2FsaWFzVHJhbnNmb3JtRmFjdG9yeSwgQ29tcGlsYXRpb25Nb2RlLCBkZWNsYXJhdGlvblRyYW5zZm9ybUZhY3RvcnksIERlY29yYXRvckhhbmRsZXIsIER0c1RyYW5zZm9ybVJlZ2lzdHJ5LCBpdnlUcmFuc2Zvcm1GYWN0b3J5LCBUcmFpdENvbXBpbGVyfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtUZW1wbGF0ZVR5cGVDaGVja2VySW1wbH0gZnJvbSAnLi4vLi4vdHlwZWNoZWNrJztcbmltcG9ydCB7T3B0aW1pemVGb3IsIFRlbXBsYXRlVHlwZUNoZWNrZXIsIFR5cGVDaGVja2luZ0NvbmZpZywgVHlwZUNoZWNraW5nUHJvZ3JhbVN0cmF0ZWd5fSBmcm9tICcuLi8uLi90eXBlY2hlY2svYXBpJztcbmltcG9ydCB7Z2V0U291cmNlRmlsZU9yTnVsbCwgaXNEdHNQYXRoLCByZXNvbHZlTW9kdWxlTmFtZX0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5pbXBvcnQge0xhenlSb3V0ZSwgTmdDb21waWxlckFkYXB0ZXIsIE5nQ29tcGlsZXJPcHRpb25zfSBmcm9tICcuLi9hcGknO1xuXG5pbXBvcnQge2NvbXBpbGVVbmRlY29yYXRlZENsYXNzZXNXaXRoQW5ndWxhckZlYXR1cmVzfSBmcm9tICcuL2NvbmZpZyc7XG5cbi8qKlxuICogU3RhdGUgaW5mb3JtYXRpb24gYWJvdXQgYSBjb21waWxhdGlvbiB3aGljaCBpcyBvbmx5IGdlbmVyYXRlZCBvbmNlIHNvbWUgZGF0YSBpcyByZXF1ZXN0ZWQgZnJvbVxuICogdGhlIGBOZ0NvbXBpbGVyYCAoZm9yIGV4YW1wbGUsIGJ5IGNhbGxpbmcgYGdldERpYWdub3N0aWNzYCkuXG4gKi9cbmludGVyZmFjZSBMYXp5Q29tcGlsYXRpb25TdGF0ZSB7XG4gIGlzQ29yZTogYm9vbGVhbjtcbiAgdHJhaXRDb21waWxlcjogVHJhaXRDb21waWxlcjtcbiAgcmVmbGVjdG9yOiBUeXBlU2NyaXB0UmVmbGVjdGlvbkhvc3Q7XG4gIG1ldGFSZWFkZXI6IE1ldGFkYXRhUmVhZGVyO1xuICBzY29wZVJlZ2lzdHJ5OiBMb2NhbE1vZHVsZVNjb3BlUmVnaXN0cnk7XG4gIHR5cGVDaGVja1Njb3BlUmVnaXN0cnk6IFR5cGVDaGVja1Njb3BlUmVnaXN0cnk7XG4gIGV4cG9ydFJlZmVyZW5jZUdyYXBoOiBSZWZlcmVuY2VHcmFwaHxudWxsO1xuICByb3V0ZUFuYWx5emVyOiBOZ01vZHVsZVJvdXRlQW5hbHl6ZXI7XG4gIGR0c1RyYW5zZm9ybXM6IER0c1RyYW5zZm9ybVJlZ2lzdHJ5O1xuICBtd3BTY2FubmVyOiBNb2R1bGVXaXRoUHJvdmlkZXJzU2Nhbm5lcjtcbiAgZGVmYXVsdEltcG9ydFRyYWNrZXI6IERlZmF1bHRJbXBvcnRUcmFja2VyO1xuICBhbGlhc2luZ0hvc3Q6IEFsaWFzaW5nSG9zdHxudWxsO1xuICByZWZFbWl0dGVyOiBSZWZlcmVuY2VFbWl0dGVyO1xuICB0ZW1wbGF0ZVR5cGVDaGVja2VyOiBUZW1wbGF0ZVR5cGVDaGVja2VyO1xuICByZXNvdXJjZVJlZ2lzdHJ5OiBSZXNvdXJjZVJlZ2lzdHJ5O1xufVxuXG5cblxuLyoqXG4gKiBEaXNjcmltaW5hbnQgdHlwZSBmb3IgYSBgQ29tcGlsYXRpb25UaWNrZXRgLlxuICovXG5leHBvcnQgZW51bSBDb21waWxhdGlvblRpY2tldEtpbmQge1xuICBGcmVzaCxcbiAgSW5jcmVtZW50YWxUeXBlU2NyaXB0LFxuICBJbmNyZW1lbnRhbFJlc291cmNlLFxufVxuXG4vKipcbiAqIEJlZ2luIGFuIEFuZ3VsYXIgY29tcGlsYXRpb24gb3BlcmF0aW9uIGZyb20gc2NyYXRjaC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGcmVzaENvbXBpbGF0aW9uVGlja2V0IHtcbiAga2luZDogQ29tcGlsYXRpb25UaWNrZXRLaW5kLkZyZXNoO1xuICBvcHRpb25zOiBOZ0NvbXBpbGVyT3B0aW9ucztcbiAgaW5jcmVtZW50YWxCdWlsZFN0cmF0ZWd5OiBJbmNyZW1lbnRhbEJ1aWxkU3RyYXRlZ3k7XG4gIHR5cGVDaGVja2luZ1Byb2dyYW1TdHJhdGVneTogVHlwZUNoZWNraW5nUHJvZ3JhbVN0cmF0ZWd5O1xuICBlbmFibGVUZW1wbGF0ZVR5cGVDaGVja2VyOiBib29sZWFuO1xuICB1c2VQb2lzb25lZERhdGE6IGJvb2xlYW47XG4gIHRzUHJvZ3JhbTogdHMuUHJvZ3JhbTtcbn1cblxuLyoqXG4gKiBCZWdpbiBhbiBBbmd1bGFyIGNvbXBpbGF0aW9uIG9wZXJhdGlvbiB0aGF0IGluY29ycG9yYXRlcyBjaGFuZ2VzIHRvIFR5cGVTY3JpcHQgY29kZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbmNyZW1lbnRhbFR5cGVTY3JpcHRDb21waWxhdGlvblRpY2tldCB7XG4gIGtpbmQ6IENvbXBpbGF0aW9uVGlja2V0S2luZC5JbmNyZW1lbnRhbFR5cGVTY3JpcHQ7XG4gIG9wdGlvbnM6IE5nQ29tcGlsZXJPcHRpb25zO1xuICBvbGRQcm9ncmFtOiB0cy5Qcm9ncmFtO1xuICBuZXdQcm9ncmFtOiB0cy5Qcm9ncmFtO1xuICBpbmNyZW1lbnRhbEJ1aWxkU3RyYXRlZ3k6IEluY3JlbWVudGFsQnVpbGRTdHJhdGVneTtcbiAgdHlwZUNoZWNraW5nUHJvZ3JhbVN0cmF0ZWd5OiBUeXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3k7XG4gIG5ld0RyaXZlcjogSW5jcmVtZW50YWxEcml2ZXI7XG4gIGVuYWJsZVRlbXBsYXRlVHlwZUNoZWNrZXI6IGJvb2xlYW47XG4gIHVzZVBvaXNvbmVkRGF0YTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbmNyZW1lbnRhbFJlc291cmNlQ29tcGlsYXRpb25UaWNrZXQge1xuICBraW5kOiBDb21waWxhdGlvblRpY2tldEtpbmQuSW5jcmVtZW50YWxSZXNvdXJjZTtcbiAgY29tcGlsZXI6IE5nQ29tcGlsZXI7XG4gIG1vZGlmaWVkUmVzb3VyY2VGaWxlczogU2V0PHN0cmluZz47XG59XG5cbi8qKlxuICogQSByZXF1ZXN0IHRvIGJlZ2luIEFuZ3VsYXIgY29tcGlsYXRpb24sIGVpdGhlciBzdGFydGluZyBmcm9tIHNjcmF0Y2ggb3IgZnJvbSBhIGtub3duIHByaW9yIHN0YXRlLlxuICpcbiAqIGBDb21waWxhdGlvblRpY2tldGBzIGFyZSB1c2VkIHRvIGluaXRpYWxpemUgKG9yIHVwZGF0ZSkgYW4gYE5nQ29tcGlsZXJgIGluc3RhbmNlLCB0aGUgY29yZSBvZiB0aGVcbiAqIEFuZ3VsYXIgY29tcGlsZXIuIFRoZXkgYWJzdHJhY3QgdGhlIHN0YXJ0aW5nIHN0YXRlIG9mIGNvbXBpbGF0aW9uIGFuZCBhbGxvdyBgTmdDb21waWxlcmAgdG8gYmVcbiAqIG1hbmFnZWQgaW5kZXBlbmRlbnRseSBvZiBhbnkgaW5jcmVtZW50YWwgY29tcGlsYXRpb24gbGlmZWN5Y2xlLlxuICovXG5leHBvcnQgdHlwZSBDb21waWxhdGlvblRpY2tldCA9IEZyZXNoQ29tcGlsYXRpb25UaWNrZXR8SW5jcmVtZW50YWxUeXBlU2NyaXB0Q29tcGlsYXRpb25UaWNrZXR8XG4gICAgSW5jcmVtZW50YWxSZXNvdXJjZUNvbXBpbGF0aW9uVGlja2V0O1xuXG4vKipcbiAqIENyZWF0ZSBhIGBDb21waWxhdGlvblRpY2tldGAgZm9yIGEgYnJhbmQgbmV3IGNvbXBpbGF0aW9uLCB1c2luZyBubyBwcmlvciBzdGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyZXNoQ29tcGlsYXRpb25UaWNrZXQoXG4gICAgdHNQcm9ncmFtOiB0cy5Qcm9ncmFtLCBvcHRpb25zOiBOZ0NvbXBpbGVyT3B0aW9ucyxcbiAgICBpbmNyZW1lbnRhbEJ1aWxkU3RyYXRlZ3k6IEluY3JlbWVudGFsQnVpbGRTdHJhdGVneSxcbiAgICB0eXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3k6IFR5cGVDaGVja2luZ1Byb2dyYW1TdHJhdGVneSwgZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcjogYm9vbGVhbixcbiAgICB1c2VQb2lzb25lZERhdGE6IGJvb2xlYW4pOiBDb21waWxhdGlvblRpY2tldCB7XG4gIHJldHVybiB7XG4gICAga2luZDogQ29tcGlsYXRpb25UaWNrZXRLaW5kLkZyZXNoLFxuICAgIHRzUHJvZ3JhbSxcbiAgICBvcHRpb25zLFxuICAgIGluY3JlbWVudGFsQnVpbGRTdHJhdGVneSxcbiAgICB0eXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3ksXG4gICAgZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcixcbiAgICB1c2VQb2lzb25lZERhdGEsXG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYENvbXBpbGF0aW9uVGlja2V0YCBhcyBlZmZpY2llbnRseSBhcyBwb3NzaWJsZSwgYmFzZWQgb24gYSBwcmV2aW91cyBgTmdDb21waWxlcmBcbiAqIGluc3RhbmNlIGFuZCBhIG5ldyBgdHMuUHJvZ3JhbWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmNyZW1lbnRhbEZyb21Db21waWxlclRpY2tldChcbiAgICBvbGRDb21waWxlcjogTmdDb21waWxlciwgbmV3UHJvZ3JhbTogdHMuUHJvZ3JhbSxcbiAgICBpbmNyZW1lbnRhbEJ1aWxkU3RyYXRlZ3k6IEluY3JlbWVudGFsQnVpbGRTdHJhdGVneSxcbiAgICB0eXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3k6IFR5cGVDaGVja2luZ1Byb2dyYW1TdHJhdGVneSxcbiAgICBtb2RpZmllZFJlc291cmNlRmlsZXM6IFNldDxzdHJpbmc+KTogQ29tcGlsYXRpb25UaWNrZXQge1xuICBjb25zdCBvbGRQcm9ncmFtID0gb2xkQ29tcGlsZXIuZ2V0TmV4dFByb2dyYW0oKTtcbiAgY29uc3Qgb2xkRHJpdmVyID0gb2xkQ29tcGlsZXIuaW5jcmVtZW50YWxTdHJhdGVneS5nZXRJbmNyZW1lbnRhbERyaXZlcihvbGRQcm9ncmFtKTtcbiAgaWYgKG9sZERyaXZlciA9PT0gbnVsbCkge1xuICAgIC8vIE5vIGluY3JlbWVudGFsIHN0ZXAgaXMgcG9zc2libGUgaGVyZSwgc2luY2Ugbm8gSW5jcmVtZW50YWxEcml2ZXIgd2FzIGZvdW5kIGZvciB0aGUgb2xkXG4gICAgLy8gcHJvZ3JhbS5cbiAgICByZXR1cm4gZnJlc2hDb21waWxhdGlvblRpY2tldChcbiAgICAgICAgbmV3UHJvZ3JhbSwgb2xkQ29tcGlsZXIub3B0aW9ucywgaW5jcmVtZW50YWxCdWlsZFN0cmF0ZWd5LCB0eXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3ksXG4gICAgICAgIG9sZENvbXBpbGVyLmVuYWJsZVRlbXBsYXRlVHlwZUNoZWNrZXIsIG9sZENvbXBpbGVyLnVzZVBvaXNvbmVkRGF0YSk7XG4gIH1cblxuICBjb25zdCBuZXdEcml2ZXIgPVxuICAgICAgSW5jcmVtZW50YWxEcml2ZXIucmVjb25jaWxlKG9sZFByb2dyYW0sIG9sZERyaXZlciwgbmV3UHJvZ3JhbSwgbW9kaWZpZWRSZXNvdXJjZUZpbGVzKTtcblxuICByZXR1cm4ge1xuICAgIGtpbmQ6IENvbXBpbGF0aW9uVGlja2V0S2luZC5JbmNyZW1lbnRhbFR5cGVTY3JpcHQsXG4gICAgZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcjogb2xkQ29tcGlsZXIuZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcixcbiAgICB1c2VQb2lzb25lZERhdGE6IG9sZENvbXBpbGVyLnVzZVBvaXNvbmVkRGF0YSxcbiAgICBvcHRpb25zOiBvbGRDb21waWxlci5vcHRpb25zLFxuICAgIGluY3JlbWVudGFsQnVpbGRTdHJhdGVneSxcbiAgICB0eXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3ksXG4gICAgbmV3RHJpdmVyLFxuICAgIG9sZFByb2dyYW0sXG4gICAgbmV3UHJvZ3JhbSxcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBgQ29tcGlsYXRpb25UaWNrZXRgIGRpcmVjdGx5IGZyb20gYW4gb2xkIGB0cy5Qcm9ncmFtYCBhbmQgYXNzb2NpYXRlZCBBbmd1bGFyIGNvbXBpbGF0aW9uXG4gKiBzdGF0ZSwgYWxvbmcgd2l0aCBhIG5ldyBgdHMuUHJvZ3JhbWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmNyZW1lbnRhbEZyb21Ecml2ZXJUaWNrZXQoXG4gICAgb2xkUHJvZ3JhbTogdHMuUHJvZ3JhbSwgb2xkRHJpdmVyOiBJbmNyZW1lbnRhbERyaXZlciwgbmV3UHJvZ3JhbTogdHMuUHJvZ3JhbSxcbiAgICBvcHRpb25zOiBOZ0NvbXBpbGVyT3B0aW9ucywgaW5jcmVtZW50YWxCdWlsZFN0cmF0ZWd5OiBJbmNyZW1lbnRhbEJ1aWxkU3RyYXRlZ3ksXG4gICAgdHlwZUNoZWNraW5nUHJvZ3JhbVN0cmF0ZWd5OiBUeXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3ksIG1vZGlmaWVkUmVzb3VyY2VGaWxlczogU2V0PHN0cmluZz4sXG4gICAgZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcjogYm9vbGVhbiwgdXNlUG9pc29uZWREYXRhOiBib29sZWFuKTogQ29tcGlsYXRpb25UaWNrZXQge1xuICBjb25zdCBuZXdEcml2ZXIgPVxuICAgICAgSW5jcmVtZW50YWxEcml2ZXIucmVjb25jaWxlKG9sZFByb2dyYW0sIG9sZERyaXZlciwgbmV3UHJvZ3JhbSwgbW9kaWZpZWRSZXNvdXJjZUZpbGVzKTtcbiAgcmV0dXJuIHtcbiAgICBraW5kOiBDb21waWxhdGlvblRpY2tldEtpbmQuSW5jcmVtZW50YWxUeXBlU2NyaXB0LFxuICAgIG9sZFByb2dyYW0sXG4gICAgbmV3UHJvZ3JhbSxcbiAgICBvcHRpb25zLFxuICAgIGluY3JlbWVudGFsQnVpbGRTdHJhdGVneSxcbiAgICBuZXdEcml2ZXIsXG4gICAgdHlwZUNoZWNraW5nUHJvZ3JhbVN0cmF0ZWd5LFxuICAgIGVuYWJsZVRlbXBsYXRlVHlwZUNoZWNrZXIsXG4gICAgdXNlUG9pc29uZWREYXRhLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb3VyY2VDaGFuZ2VUaWNrZXQoY29tcGlsZXI6IE5nQ29tcGlsZXIsIG1vZGlmaWVkUmVzb3VyY2VGaWxlczogU2V0PHN0cmluZz4pOlxuICAgIEluY3JlbWVudGFsUmVzb3VyY2VDb21waWxhdGlvblRpY2tldCB7XG4gIHJldHVybiB7XG4gICAga2luZDogQ29tcGlsYXRpb25UaWNrZXRLaW5kLkluY3JlbWVudGFsUmVzb3VyY2UsXG4gICAgY29tcGlsZXIsXG4gICAgbW9kaWZpZWRSZXNvdXJjZUZpbGVzLFxuICB9O1xufVxuXG5cbi8qKlxuICogVGhlIGhlYXJ0IG9mIHRoZSBBbmd1bGFyIEl2eSBjb21waWxlci5cbiAqXG4gKiBUaGUgYE5nQ29tcGlsZXJgIHByb3ZpZGVzIGFuIEFQSSBmb3IgcGVyZm9ybWluZyBBbmd1bGFyIGNvbXBpbGF0aW9uIHdpdGhpbiBhIGN1c3RvbSBUeXBlU2NyaXB0XG4gKiBjb21waWxlci4gRWFjaCBpbnN0YW5jZSBvZiBgTmdDb21waWxlcmAgc3VwcG9ydHMgYSBzaW5nbGUgY29tcGlsYXRpb24sIHdoaWNoIG1pZ2h0IGJlXG4gKiBpbmNyZW1lbnRhbC5cbiAqXG4gKiBgTmdDb21waWxlcmAgaXMgbGF6eSwgYW5kIGRvZXMgbm90IHBlcmZvcm0gYW55IG9mIHRoZSB3b3JrIG9mIHRoZSBjb21waWxhdGlvbiB1bnRpbCBvbmUgb2YgaXRzXG4gKiBvdXRwdXQgbWV0aG9kcyAoZS5nLiBgZ2V0RGlhZ25vc3RpY3NgKSBpcyBjYWxsZWQuXG4gKlxuICogU2VlIHRoZSBSRUFETUUubWQgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ0NvbXBpbGVyIHtcbiAgLyoqXG4gICAqIExhemlseSBldmFsdWF0ZWQgc3RhdGUgb2YgdGhlIGNvbXBpbGF0aW9uLlxuICAgKlxuICAgKiBUaGlzIGlzIGNyZWF0ZWQgb24gZGVtYW5kIGJ5IGNhbGxpbmcgYGVuc3VyZUFuYWx5emVkYC5cbiAgICovXG4gIHByaXZhdGUgY29tcGlsYXRpb246IExhenlDb21waWxhdGlvblN0YXRlfG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBBbnkgZGlhZ25vc3RpY3MgcmVsYXRlZCB0byB0aGUgY29uc3RydWN0aW9uIG9mIHRoZSBjb21waWxhdGlvbi5cbiAgICpcbiAgICogVGhlc2UgYXJlIGRpYWdub3N0aWNzIHdoaWNoIGFyb3NlIGR1cmluZyBzZXR1cCBvZiB0aGUgaG9zdCBhbmQvb3IgcHJvZ3JhbS5cbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0aW9uRGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBOb24tdGVtcGxhdGUgZGlhZ25vc3RpY3MgcmVsYXRlZCB0byB0aGUgcHJvZ3JhbSBpdHNlbGYuIERvZXMgbm90IGluY2x1ZGUgdGVtcGxhdGVcbiAgICogZGlhZ25vc3RpY3MgYmVjYXVzZSB0aGUgdGVtcGxhdGUgdHlwZSBjaGVja2VyIG1lbW9pemVzIHRoZW0gaXRzZWxmLlxuICAgKlxuICAgKiBUaGlzIGlzIHNldCBieSAoYW5kIG1lbW9pemVzKSBgZ2V0Tm9uVGVtcGxhdGVEaWFnbm9zdGljc2AuXG4gICAqL1xuICBwcml2YXRlIG5vblRlbXBsYXRlRGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXXxudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGNsb3N1cmVDb21waWxlckVuYWJsZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgbmV4dFByb2dyYW06IHRzLlByb2dyYW07XG4gIHByaXZhdGUgZW50cnlQb2ludDogdHMuU291cmNlRmlsZXxudWxsO1xuICBwcml2YXRlIG1vZHVsZVJlc29sdmVyOiBNb2R1bGVSZXNvbHZlcjtcbiAgcHJpdmF0ZSByZXNvdXJjZU1hbmFnZXI6IEFkYXB0ZXJSZXNvdXJjZUxvYWRlcjtcbiAgcHJpdmF0ZSBjeWNsZUFuYWx5emVyOiBDeWNsZUFuYWx5emVyO1xuICByZWFkb25seSBpZ25vcmVGb3JEaWFnbm9zdGljczogU2V0PHRzLlNvdXJjZUZpbGU+O1xuICByZWFkb25seSBpZ25vcmVGb3JFbWl0OiBTZXQ8dHMuU291cmNlRmlsZT47XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSBgQ29tcGlsYXRpb25UaWNrZXRgIGludG8gYW4gYE5nQ29tcGlsZXJgIGluc3RhbmNlIGZvciB0aGUgcmVxdWVzdGVkIGNvbXBpbGF0aW9uLlxuICAgKlxuICAgKiBEZXBlbmRpbmcgb24gdGhlIG5hdHVyZSBvZiB0aGUgY29tcGlsYXRpb24gcmVxdWVzdCwgdGhlIGBOZ0NvbXBpbGVyYCBpbnN0YW5jZSBtYXkgYmUgcmV1c2VkXG4gICAqIGZyb20gYSBwcmV2aW91cyBjb21waWxhdGlvbiBhbmQgdXBkYXRlZCB3aXRoIGFueSBjaGFuZ2VzLCBpdCBtYXkgYmUgYSBuZXcgaW5zdGFuY2Ugd2hpY2hcbiAgICogaW5jcmVtZW50YWxseSByZXVzZXMgc3RhdGUgZnJvbSBhIHByZXZpb3VzIGNvbXBpbGF0aW9uLCBvciBpdCBtYXkgcmVwcmVzZW50IGEgZnJlc2ggY29tcGlsYXRpb25cbiAgICogZW50aXJlbHkuXG4gICAqL1xuICBzdGF0aWMgZnJvbVRpY2tldChcbiAgICAgIHRpY2tldDogQ29tcGlsYXRpb25UaWNrZXQsIGFkYXB0ZXI6IE5nQ29tcGlsZXJBZGFwdGVyLCBwZXJmUmVjb3JkZXI/OiBQZXJmUmVjb3JkZXIpIHtcbiAgICBzd2l0Y2ggKHRpY2tldC5raW5kKSB7XG4gICAgICBjYXNlIENvbXBpbGF0aW9uVGlja2V0S2luZC5GcmVzaDpcbiAgICAgICAgcmV0dXJuIG5ldyBOZ0NvbXBpbGVyKFxuICAgICAgICAgICAgYWRhcHRlcixcbiAgICAgICAgICAgIHRpY2tldC5vcHRpb25zLFxuICAgICAgICAgICAgdGlja2V0LnRzUHJvZ3JhbSxcbiAgICAgICAgICAgIHRpY2tldC50eXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3ksXG4gICAgICAgICAgICB0aWNrZXQuaW5jcmVtZW50YWxCdWlsZFN0cmF0ZWd5LFxuICAgICAgICAgICAgSW5jcmVtZW50YWxEcml2ZXIuZnJlc2godGlja2V0LnRzUHJvZ3JhbSksXG4gICAgICAgICAgICB0aWNrZXQuZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcixcbiAgICAgICAgICAgIHRpY2tldC51c2VQb2lzb25lZERhdGEsXG4gICAgICAgICAgICBwZXJmUmVjb3JkZXIsXG4gICAgICAgICk7XG4gICAgICBjYXNlIENvbXBpbGF0aW9uVGlja2V0S2luZC5JbmNyZW1lbnRhbFR5cGVTY3JpcHQ6XG4gICAgICAgIHJldHVybiBuZXcgTmdDb21waWxlcihcbiAgICAgICAgICAgIGFkYXB0ZXIsXG4gICAgICAgICAgICB0aWNrZXQub3B0aW9ucyxcbiAgICAgICAgICAgIHRpY2tldC5uZXdQcm9ncmFtLFxuICAgICAgICAgICAgdGlja2V0LnR5cGVDaGVja2luZ1Byb2dyYW1TdHJhdGVneSxcbiAgICAgICAgICAgIHRpY2tldC5pbmNyZW1lbnRhbEJ1aWxkU3RyYXRlZ3ksXG4gICAgICAgICAgICB0aWNrZXQubmV3RHJpdmVyLFxuICAgICAgICAgICAgdGlja2V0LmVuYWJsZVRlbXBsYXRlVHlwZUNoZWNrZXIsXG4gICAgICAgICAgICB0aWNrZXQudXNlUG9pc29uZWREYXRhLFxuICAgICAgICAgICAgcGVyZlJlY29yZGVyLFxuICAgICAgICApO1xuICAgICAgY2FzZSBDb21waWxhdGlvblRpY2tldEtpbmQuSW5jcmVtZW50YWxSZXNvdXJjZTpcbiAgICAgICAgY29uc3QgY29tcGlsZXIgPSB0aWNrZXQuY29tcGlsZXI7XG4gICAgICAgIGNvbXBpbGVyLnVwZGF0ZVdpdGhDaGFuZ2VkUmVzb3VyY2VzKHRpY2tldC5tb2RpZmllZFJlc291cmNlRmlsZXMpO1xuICAgICAgICByZXR1cm4gY29tcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgYWRhcHRlcjogTmdDb21waWxlckFkYXB0ZXIsXG4gICAgICByZWFkb25seSBvcHRpb25zOiBOZ0NvbXBpbGVyT3B0aW9ucyxcbiAgICAgIHByaXZhdGUgdHNQcm9ncmFtOiB0cy5Qcm9ncmFtLFxuICAgICAgcmVhZG9ubHkgdHlwZUNoZWNraW5nUHJvZ3JhbVN0cmF0ZWd5OiBUeXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3ksXG4gICAgICByZWFkb25seSBpbmNyZW1lbnRhbFN0cmF0ZWd5OiBJbmNyZW1lbnRhbEJ1aWxkU3RyYXRlZ3ksXG4gICAgICByZWFkb25seSBpbmNyZW1lbnRhbERyaXZlcjogSW5jcmVtZW50YWxEcml2ZXIsXG4gICAgICByZWFkb25seSBlbmFibGVUZW1wbGF0ZVR5cGVDaGVja2VyOiBib29sZWFuLFxuICAgICAgcmVhZG9ubHkgdXNlUG9pc29uZWREYXRhOiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSBwZXJmUmVjb3JkZXI6IFBlcmZSZWNvcmRlciA9IE5PT1BfUEVSRl9SRUNPUkRFUixcbiAgKSB7XG4gICAgdGhpcy5jb25zdHJ1Y3Rpb25EaWFnbm9zdGljcy5wdXNoKC4uLnRoaXMuYWRhcHRlci5jb25zdHJ1Y3Rpb25EaWFnbm9zdGljcyk7XG4gICAgY29uc3QgaW5jb21wYXRpYmxlVHlwZUNoZWNrT3B0aW9uc0RpYWdub3N0aWMgPSB2ZXJpZnlDb21wYXRpYmxlVHlwZUNoZWNrT3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xuICAgIGlmIChpbmNvbXBhdGlibGVUeXBlQ2hlY2tPcHRpb25zRGlhZ25vc3RpYyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3Rpb25EaWFnbm9zdGljcy5wdXNoKGluY29tcGF0aWJsZVR5cGVDaGVja09wdGlvbnNEaWFnbm9zdGljKTtcbiAgICB9XG5cbiAgICB0aGlzLm5leHRQcm9ncmFtID0gdHNQcm9ncmFtO1xuICAgIHRoaXMuY2xvc3VyZUNvbXBpbGVyRW5hYmxlZCA9ICEhdGhpcy5vcHRpb25zLmFubm90YXRlRm9yQ2xvc3VyZUNvbXBpbGVyO1xuXG4gICAgdGhpcy5lbnRyeVBvaW50ID1cbiAgICAgICAgYWRhcHRlci5lbnRyeVBvaW50ICE9PSBudWxsID8gZ2V0U291cmNlRmlsZU9yTnVsbCh0c1Byb2dyYW0sIGFkYXB0ZXIuZW50cnlQb2ludCkgOiBudWxsO1xuXG4gICAgY29uc3QgbW9kdWxlUmVzb2x1dGlvbkNhY2hlID0gdHMuY3JlYXRlTW9kdWxlUmVzb2x1dGlvbkNhY2hlKFxuICAgICAgICB0aGlzLmFkYXB0ZXIuZ2V0Q3VycmVudERpcmVjdG9yeSgpLFxuICAgICAgICAvLyBOb3RlOiB0aGlzIHVzZWQgdG8gYmUgYW4gYXJyb3ctZnVuY3Rpb24gY2xvc3VyZS4gSG93ZXZlciwgSlMgZW5naW5lcyBsaWtlIHY4IGhhdmUgc29tZVxuICAgICAgICAvLyBzdHJhbmdlIGJlaGF2aW9ycyB3aXRoIHJldGFpbmluZyB0aGUgbGV4aWNhbCBzY29wZSBvZiB0aGUgY2xvc3VyZS4gRXZlbiBpZiB0aGlzIGZ1bmN0aW9uXG4gICAgICAgIC8vIGRvZXNuJ3QgcmV0YWluIGEgcmVmZXJlbmNlIHRvIGB0aGlzYCwgaWYgb3RoZXIgY2xvc3VyZXMgaW4gdGhlIGNvbnN0cnVjdG9yIGhlcmUgcmVmZXJlbmNlXG4gICAgICAgIC8vIGB0aGlzYCBpbnRlcm5hbGx5IHRoZW4gYSBjbG9zdXJlIGNyZWF0ZWQgaGVyZSB3b3VsZCByZXRhaW4gdGhlbS4gVGhpcyBjYW4gY2F1c2UgbWFqb3JcbiAgICAgICAgLy8gbWVtb3J5IGxlYWsgaXNzdWVzIHNpbmNlIHRoZSBgbW9kdWxlUmVzb2x1dGlvbkNhY2hlYCBpcyBhIGxvbmctbGl2ZWQgb2JqZWN0IGFuZCBmaW5kcyBpdHNcbiAgICAgICAgLy8gd2F5IGludG8gYWxsIGtpbmRzIG9mIHBsYWNlcyBpbnNpZGUgVFMgaW50ZXJuYWwgb2JqZWN0cy5cbiAgICAgICAgdGhpcy5hZGFwdGVyLmdldENhbm9uaWNhbEZpbGVOYW1lLmJpbmQodGhpcy5hZGFwdGVyKSk7XG4gICAgdGhpcy5tb2R1bGVSZXNvbHZlciA9XG4gICAgICAgIG5ldyBNb2R1bGVSZXNvbHZlcih0c1Byb2dyYW0sIHRoaXMub3B0aW9ucywgdGhpcy5hZGFwdGVyLCBtb2R1bGVSZXNvbHV0aW9uQ2FjaGUpO1xuICAgIHRoaXMucmVzb3VyY2VNYW5hZ2VyID0gbmV3IEFkYXB0ZXJSZXNvdXJjZUxvYWRlcihhZGFwdGVyLCB0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMuY3ljbGVBbmFseXplciA9IG5ldyBDeWNsZUFuYWx5emVyKG5ldyBJbXBvcnRHcmFwaCh0c1Byb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKSkpO1xuICAgIHRoaXMuaW5jcmVtZW50YWxTdHJhdGVneS5zZXRJbmNyZW1lbnRhbERyaXZlcih0aGlzLmluY3JlbWVudGFsRHJpdmVyLCB0c1Byb2dyYW0pO1xuXG4gICAgdGhpcy5pZ25vcmVGb3JEaWFnbm9zdGljcyA9XG4gICAgICAgIG5ldyBTZXQodHNQcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkuZmlsdGVyKHNmID0+IHRoaXMuYWRhcHRlci5pc1NoaW0oc2YpKSk7XG4gICAgdGhpcy5pZ25vcmVGb3JFbWl0ID0gdGhpcy5hZGFwdGVyLmlnbm9yZUZvckVtaXQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVdpdGhDaGFuZ2VkUmVzb3VyY2VzKGNoYW5nZWRSZXNvdXJjZXM6IFNldDxzdHJpbmc+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29tcGlsYXRpb24gPT09IG51bGwpIHtcbiAgICAgIC8vIEFuYWx5c2lzIGhhc24ndCBoYXBwZW5lZCB5ZXQsIHNvIG5vIHVwZGF0ZSBpcyBuZWNlc3NhcnkgLSBhbnkgY2hhbmdlcyB0byByZXNvdXJjZXMgd2lsbCBiZVxuICAgICAgLy8gY2FwdHVyZWQgYnkgdGhlIGluaXRhbCBhbmFseXNpcyBwYXNzIGl0c2VsZi5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlc291cmNlTWFuYWdlci5pbnZhbGlkYXRlKCk7XG5cbiAgICBjb25zdCBjbGFzc2VzVG9VcGRhdGUgPSBuZXcgU2V0PERlY2xhcmF0aW9uTm9kZT4oKTtcbiAgICBmb3IgKGNvbnN0IHJlc291cmNlRmlsZSBvZiBjaGFuZ2VkUmVzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlQ2xhc3Mgb2YgdGhpcy5nZXRDb21wb25lbnRzV2l0aFRlbXBsYXRlRmlsZShyZXNvdXJjZUZpbGUpKSB7XG4gICAgICAgIGNsYXNzZXNUb1VwZGF0ZS5hZGQodGVtcGxhdGVDbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3Qgc3R5bGVDbGFzcyBvZiB0aGlzLmdldENvbXBvbmVudHNXaXRoU3R5bGVGaWxlKHJlc291cmNlRmlsZSkpIHtcbiAgICAgICAgY2xhc3Nlc1RvVXBkYXRlLmFkZChzdHlsZUNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNsYXp6IG9mIGNsYXNzZXNUb1VwZGF0ZSkge1xuICAgICAgdGhpcy5jb21waWxhdGlvbi50cmFpdENvbXBpbGVyLnVwZGF0ZVJlc291cmNlcyhjbGF6eik7XG4gICAgICBpZiAoIXRzLmlzQ2xhc3NEZWNsYXJhdGlvbihjbGF6eikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29tcGlsYXRpb24udGVtcGxhdGVUeXBlQ2hlY2tlci5pbnZhbGlkYXRlQ2xhc3MoY2xhenopO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJlc291cmNlIGRlcGVuZGVuY2llcyBvZiBhIGZpbGUuXG4gICAqXG4gICAqIElmIHRoZSBmaWxlIGlzIG5vdCBwYXJ0IG9mIHRoZSBjb21waWxhdGlvbiwgYW4gZW1wdHkgYXJyYXkgd2lsbCBiZSByZXR1cm5lZC5cbiAgICovXG4gIGdldFJlc291cmNlRGVwZW5kZW5jaWVzKGZpbGU6IHRzLlNvdXJjZUZpbGUpOiBzdHJpbmdbXSB7XG4gICAgdGhpcy5lbnN1cmVBbmFseXplZCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuaW5jcmVtZW50YWxEcml2ZXIuZGVwR3JhcGguZ2V0UmVzb3VyY2VEZXBlbmRlbmNpZXMoZmlsZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBBbmd1bGFyLXJlbGF0ZWQgZGlhZ25vc3RpY3MgZm9yIHRoaXMgY29tcGlsYXRpb24uXG4gICAqL1xuICBnZXREaWFnbm9zdGljcygpOiB0cy5EaWFnbm9zdGljW10ge1xuICAgIHJldHVybiB0aGlzLmFkZE1lc3NhZ2VUZXh0RGV0YWlscyhcbiAgICAgICAgWy4uLnRoaXMuZ2V0Tm9uVGVtcGxhdGVEaWFnbm9zdGljcygpLCAuLi50aGlzLmdldFRlbXBsYXRlRGlhZ25vc3RpY3MoKV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgQW5ndWxhci1yZWxhdGVkIGRpYWdub3N0aWNzIGZvciB0aGlzIGNvbXBpbGF0aW9uLlxuICAgKlxuICAgKiBJZiBhIGB0cy5Tb3VyY2VGaWxlYCBpcyBwYXNzZWQsIG9ubHkgZGlhZ25vc3RpY3MgcmVsYXRlZCB0byB0aGF0IGZpbGUgYXJlIHJldHVybmVkLlxuICAgKi9cbiAgZ2V0RGlhZ25vc3RpY3NGb3JGaWxlKGZpbGU6IHRzLlNvdXJjZUZpbGUsIG9wdGltaXplRm9yOiBPcHRpbWl6ZUZvcik6IHRzLkRpYWdub3N0aWNbXSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZVRleHREZXRhaWxzKFtcbiAgICAgIC4uLnRoaXMuZ2V0Tm9uVGVtcGxhdGVEaWFnbm9zdGljcygpLmZpbHRlcihkaWFnID0+IGRpYWcuZmlsZSA9PT0gZmlsZSksXG4gICAgICAuLi50aGlzLmdldFRlbXBsYXRlRGlhZ25vc3RpY3NGb3JGaWxlKGZpbGUsIG9wdGltaXplRm9yKVxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBBbmd1bGFyLmlvIGVycm9yIGd1aWRlIGxpbmtzIHRvIGRpYWdub3N0aWNzIGZvciB0aGlzIGNvbXBpbGF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBhZGRNZXNzYWdlVGV4dERldGFpbHMoZGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSk6IHRzLkRpYWdub3N0aWNbXSB7XG4gICAgcmV0dXJuIGRpYWdub3N0aWNzLm1hcChkaWFnID0+IHtcbiAgICAgIGlmIChkaWFnLmNvZGUgJiYgQ09NUElMRVJfRVJST1JTX1dJVEhfR1VJREVTLmhhcyhuZ0Vycm9yQ29kZShkaWFnLmNvZGUpKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmRpYWcsXG4gICAgICAgICAgbWVzc2FnZVRleHQ6IGRpYWcubWVzc2FnZVRleHQgK1xuICAgICAgICAgICAgICBgLiBGaW5kIG1vcmUgYXQgJHtFUlJPUl9ERVRBSUxTX1BBR0VfQkFTRV9VUkx9L05HJHtuZ0Vycm9yQ29kZShkaWFnLmNvZGUpfWBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkaWFnO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgc2V0dXAtcmVsYXRlZCBkaWFnbm9zdGljcyBmb3IgdGhpcyBjb21waWxhdGlvbi5cbiAgICovXG4gIGdldE9wdGlvbkRpYWdub3N0aWNzKCk6IHRzLkRpYWdub3N0aWNbXSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0aW9uRGlhZ25vc3RpY3M7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBgdHMuUHJvZ3JhbWAgdG8gdXNlIGFzIGEgc3RhcnRpbmcgcG9pbnQgd2hlbiBzcGF3bmluZyBhIHN1YnNlcXVlbnQgaW5jcmVtZW50YWxcbiAgICogY29tcGlsYXRpb24uXG4gICAqXG4gICAqIFRoZSBgTmdDb21waWxlcmAgc3Bhd25zIGFuIGludGVybmFsIGluY3JlbWVudGFsIFR5cGVTY3JpcHQgY29tcGlsYXRpb24gKGluaGVyaXRpbmcgdGhlXG4gICAqIGNvbnN1bWVyJ3MgYHRzLlByb2dyYW1gIGludG8gYSBuZXcgb25lIGZvciB0aGUgcHVycG9zZXMgb2YgdGVtcGxhdGUgdHlwZS1jaGVja2luZykuIEFmdGVyIHRoaXNcbiAgICogb3BlcmF0aW9uLCB0aGUgY29uc3VtZXIncyBgdHMuUHJvZ3JhbWAgaXMgbm8gbG9uZ2VyIHVzYWJsZSBmb3Igc3RhcnRpbmcgYSBuZXcgaW5jcmVtZW50YWxcbiAgICogY29tcGlsYXRpb24uIGBnZXROZXh0UHJvZ3JhbWAgcmV0cmlldmVzIHRoZSBgdHMuUHJvZ3JhbWAgd2hpY2ggY2FuIGJlIHVzZWQgaW5zdGVhZC5cbiAgICovXG4gIGdldE5leHRQcm9ncmFtKCk6IHRzLlByb2dyYW0ge1xuICAgIHJldHVybiB0aGlzLm5leHRQcm9ncmFtO1xuICB9XG5cbiAgZ2V0VGVtcGxhdGVUeXBlQ2hlY2tlcigpOiBUZW1wbGF0ZVR5cGVDaGVja2VyIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdUaGUgYFRlbXBsYXRlVHlwZUNoZWNrZXJgIGRvZXMgbm90IHdvcmsgd2l0aG91dCBgZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcmAuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVuc3VyZUFuYWx5emVkKCkudGVtcGxhdGVUeXBlQ2hlY2tlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGB0cy5EZWNsYXJhdGlvbmBzIGZvciBhbnkgY29tcG9uZW50KHMpIHdoaWNoIHVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGUgZmlsZS5cbiAgICovXG4gIGdldENvbXBvbmVudHNXaXRoVGVtcGxhdGVGaWxlKHRlbXBsYXRlRmlsZVBhdGg6IHN0cmluZyk6IFJlYWRvbmx5U2V0PERlY2xhcmF0aW9uTm9kZT4ge1xuICAgIGNvbnN0IHtyZXNvdXJjZVJlZ2lzdHJ5fSA9IHRoaXMuZW5zdXJlQW5hbHl6ZWQoKTtcbiAgICByZXR1cm4gcmVzb3VyY2VSZWdpc3RyeS5nZXRDb21wb25lbnRzV2l0aFRlbXBsYXRlKHJlc29sdmUodGVtcGxhdGVGaWxlUGF0aCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgYHRzLkRlY2xhcmF0aW9uYHMgZm9yIGFueSBjb21wb25lbnQocykgd2hpY2ggdXNlIHRoZSBnaXZlbiB0ZW1wbGF0ZSBmaWxlLlxuICAgKi9cbiAgZ2V0Q29tcG9uZW50c1dpdGhTdHlsZUZpbGUoc3R5bGVGaWxlUGF0aDogc3RyaW5nKTogUmVhZG9ubHlTZXQ8RGVjbGFyYXRpb25Ob2RlPiB7XG4gICAgY29uc3Qge3Jlc291cmNlUmVnaXN0cnl9ID0gdGhpcy5lbnN1cmVBbmFseXplZCgpO1xuICAgIHJldHVybiByZXNvdXJjZVJlZ2lzdHJ5LmdldENvbXBvbmVudHNXaXRoU3R5bGUocmVzb2x2ZShzdHlsZUZpbGVQYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGV4dGVybmFsIHJlc291cmNlcyBmb3IgdGhlIGdpdmVuIGNvbXBvbmVudC5cbiAgICovXG4gIGdldENvbXBvbmVudFJlc291cmNlcyhjbGFzc0RlY2w6IERlY2xhcmF0aW9uTm9kZSk6IENvbXBvbmVudFJlc291cmNlc3xudWxsIHtcbiAgICBpZiAoIWlzTmFtZWRDbGFzc0RlY2xhcmF0aW9uKGNsYXNzRGVjbCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7cmVzb3VyY2VSZWdpc3RyeX0gPSB0aGlzLmVuc3VyZUFuYWx5emVkKCk7XG4gICAgY29uc3Qgc3R5bGVzID0gcmVzb3VyY2VSZWdpc3RyeS5nZXRTdHlsZXMoY2xhc3NEZWNsKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHJlc291cmNlUmVnaXN0cnkuZ2V0VGVtcGxhdGUoY2xhc3NEZWNsKTtcbiAgICBpZiAodGVtcGxhdGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7c3R5bGVzLCB0ZW1wbGF0ZX07XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybSBBbmd1bGFyJ3MgYW5hbHlzaXMgc3RlcCAoYXMgYSBwcmVjdXJzb3IgdG8gYGdldERpYWdub3N0aWNzYCBvciBgcHJlcGFyZUVtaXRgKVxuICAgKiBhc3luY2hyb25vdXNseS5cbiAgICpcbiAgICogTm9ybWFsbHksIHRoaXMgb3BlcmF0aW9uIGhhcHBlbnMgbGF6aWx5IHdoZW5ldmVyIGBnZXREaWFnbm9zdGljc2Agb3IgYHByZXBhcmVFbWl0YCBhcmUgY2FsbGVkLlxuICAgKiBIb3dldmVyLCBjZXJ0YWluIGNvbnN1bWVycyBtYXkgd2lzaCB0byBhbGxvdyBmb3IgYW4gYXN5bmNocm9ub3VzIHBoYXNlIG9mIGFuYWx5c2lzLCB3aGVyZVxuICAgKiByZXNvdXJjZXMgc3VjaCBhcyBgc3R5bGVVcmxzYCBhcmUgcmVzb2x2ZWQgYXN5bmNob25vdXNseS4gSW4gdGhlc2UgY2FzZXMgYGFuYWx5emVBc3luY2AgbXVzdCBiZVxuICAgKiBjYWxsZWQgZmlyc3QsIGFuZCBpdHMgYFByb21pc2VgIGF3YWl0ZWQgcHJpb3IgdG8gY2FsbGluZyBhbnkgb3RoZXIgQVBJcyBvZiBgTmdDb21waWxlcmAuXG4gICAqL1xuICBhc3luYyBhbmFseXplQXN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuY29tcGlsYXRpb24gIT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jb21waWxhdGlvbiA9IHRoaXMubWFrZUNvbXBpbGF0aW9uKCk7XG5cbiAgICBjb25zdCBhbmFseXplU3BhbiA9IHRoaXMucGVyZlJlY29yZGVyLnN0YXJ0KCdhbmFseXplJyk7XG4gICAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xuICAgIGZvciAoY29uc3Qgc2Ygb2YgdGhpcy50c1Byb2dyYW0uZ2V0U291cmNlRmlsZXMoKSkge1xuICAgICAgaWYgKHNmLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhbmFseXplRmlsZVNwYW4gPSB0aGlzLnBlcmZSZWNvcmRlci5zdGFydCgnYW5hbHl6ZUZpbGUnLCBzZik7XG4gICAgICBsZXQgYW5hbHlzaXNQcm9taXNlID0gdGhpcy5jb21waWxhdGlvbi50cmFpdENvbXBpbGVyLmFuYWx5emVBc3luYyhzZik7XG4gICAgICB0aGlzLnNjYW5Gb3JNd3Aoc2YpO1xuICAgICAgaWYgKGFuYWx5c2lzUHJvbWlzZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMucGVyZlJlY29yZGVyLnN0b3AoYW5hbHl6ZUZpbGVTcGFuKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wZXJmUmVjb3JkZXIuZW5hYmxlZCkge1xuICAgICAgICBhbmFseXNpc1Byb21pc2UgPSBhbmFseXNpc1Byb21pc2UudGhlbigoKSA9PiB0aGlzLnBlcmZSZWNvcmRlci5zdG9wKGFuYWx5emVGaWxlU3BhbikpO1xuICAgICAgfVxuICAgICAgaWYgKGFuYWx5c2lzUHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb21pc2VzLnB1c2goYW5hbHlzaXNQcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cbiAgICB0aGlzLnBlcmZSZWNvcmRlci5zdG9wKGFuYWx5emVTcGFuKTtcblxuICAgIHRoaXMucmVzb2x2ZUNvbXBpbGF0aW9uKHRoaXMuY29tcGlsYXRpb24udHJhaXRDb21waWxlcik7XG4gIH1cblxuICAvKipcbiAgICogTGlzdCBsYXp5IHJvdXRlcyBkZXRlY3RlZCBkdXJpbmcgYW5hbHlzaXMuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIGNhbGxlZCBmb3Igb25lIHNwZWNpZmljIHJvdXRlLCBvciB0byByZXRyaWV2ZSBhbGwgdG9wLWxldmVsIHJvdXRlcy5cbiAgICovXG4gIGxpc3RMYXp5Um91dGVzKGVudHJ5Um91dGU/OiBzdHJpbmcpOiBMYXp5Um91dGVbXSB7XG4gICAgaWYgKGVudHJ5Um91dGUpIHtcbiAgICAgIC8vIE5vdGU6XG4gICAgICAvLyBUaGlzIHJlc29sdXRpb24gc3RlcCBpcyBoZXJlIHRvIG1hdGNoIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgb2xkIGBBb3RDb21waWxlckhvc3RgIChzZWVcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi81MDczMmUxNTYvcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvY29tcGlsZXJfaG9zdC50cyNMMTc1LUwxODgpLlxuICAgICAgLy9cbiAgICAgIC8vIGBAYW5ndWxhci9jbGlgIHdpbGwgYWx3YXlzIGNhbGwgdGhpcyBBUEkgd2l0aCBhbiBhYnNvbHV0ZSBwYXRoLCBzbyB0aGUgcmVzb2x1dGlvbiBzdGVwIGlzXG4gICAgICAvLyBub3QgbmVjZXNzYXJ5LCBidXQga2VlcGluZyBpdCBiYWNrd2FyZHMgY29tcGF0aWJsZSBpbiBjYXNlIHNvbWVvbmUgZWxzZSBpcyB1c2luZyB0aGUgQVBJLlxuXG4gICAgICAvLyBSZWxhdGl2ZSBlbnRyeSBwYXRocyBhcmUgZGlzYWxsb3dlZC5cbiAgICAgIGlmIChlbnRyeVJvdXRlLnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsaXN0IGxhenkgcm91dGVzOiBSZXNvbHV0aW9uIG9mIHJlbGF0aXZlIHBhdGhzICgke1xuICAgICAgICAgICAgZW50cnlSb3V0ZX0pIGlzIG5vdCBzdXBwb3J0ZWQuYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vbi1yZWxhdGl2ZSBlbnRyeSBwYXRocyBmYWxsIGludG8gb25lIG9mIHRoZSBmb2xsb3dpbmcgY2F0ZWdvcmllczpcbiAgICAgIC8vIC0gQWJzb2x1dGUgc3lzdGVtIHBhdGhzIChlLmcuIGAvZm9vL2Jhci9teS1wcm9qZWN0L215LW1vZHVsZWApLCB3aGljaCBhcmUgdW5hZmZlY3RlZCBieSB0aGVcbiAgICAgIC8vICAgbG9naWMgYmVsb3cuXG4gICAgICAvLyAtIFBhdGhzIHRvIGVudGVybmFsIG1vZHVsZXMgKGUuZy4gYHNvbWUtbGliYCkuXG4gICAgICAvLyAtIFBhdGhzIG1hcHBlZCB0byBkaXJlY3RvcmllcyBpbiBgdHNjb25maWcuanNvbmAgKGUuZy4gYHNoYXJlZC9teS1tb2R1bGVgKS5cbiAgICAgIC8vICAgKFNlZSBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9tb2R1bGUtcmVzb2x1dGlvbi5odG1sI3BhdGgtbWFwcGluZy4pXG4gICAgICAvL1xuICAgICAgLy8gSW4gYWxsIGNhc2VzIGFib3ZlLCB0aGUgYGNvbnRhaW5pbmdGaWxlYCBhcmd1bWVudCBpcyBpZ25vcmVkLCBzbyB3ZSBjYW4ganVzdCB0YWtlIHRoZSBmaXJzdFxuICAgICAgLy8gb2YgdGhlIHJvb3QgZmlsZXMuXG4gICAgICBjb25zdCBjb250YWluaW5nRmlsZSA9IHRoaXMudHNQcm9ncmFtLmdldFJvb3RGaWxlTmFtZXMoKVswXTtcbiAgICAgIGNvbnN0IFtlbnRyeVBhdGgsIG1vZHVsZU5hbWVdID0gZW50cnlSb3V0ZS5zcGxpdCgnIycpO1xuICAgICAgY29uc3QgcmVzb2x2ZWRNb2R1bGUgPVxuICAgICAgICAgIHJlc29sdmVNb2R1bGVOYW1lKGVudHJ5UGF0aCwgY29udGFpbmluZ0ZpbGUsIHRoaXMub3B0aW9ucywgdGhpcy5hZGFwdGVyLCBudWxsKTtcblxuICAgICAgaWYgKHJlc29sdmVkTW9kdWxlKSB7XG4gICAgICAgIGVudHJ5Um91dGUgPSBlbnRyeVBvaW50S2V5Rm9yKHJlc29sdmVkTW9kdWxlLnJlc29sdmVkRmlsZU5hbWUsIG1vZHVsZU5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGF0aW9uID0gdGhpcy5lbnN1cmVBbmFseXplZCgpO1xuICAgIHJldHVybiBjb21waWxhdGlvbi5yb3V0ZUFuYWx5emVyLmxpc3RMYXp5Um91dGVzKGVudHJ5Um91dGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIHRyYW5zZm9ybWVycyBhbmQgb3RoZXIgaW5mb3JtYXRpb24gd2hpY2ggaXMgbmVjZXNzYXJ5IGZvciBhIGNvbnN1bWVyIHRvIGBlbWl0YCB0aGVcbiAgICogcHJvZ3JhbSB3aXRoIEFuZ3VsYXItYWRkZWQgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBwcmVwYXJlRW1pdCgpOiB7XG4gICAgdHJhbnNmb3JtZXJzOiB0cy5DdXN0b21UcmFuc2Zvcm1lcnMsXG4gIH0ge1xuICAgIGNvbnN0IGNvbXBpbGF0aW9uID0gdGhpcy5lbnN1cmVBbmFseXplZCgpO1xuXG4gICAgY29uc3QgY29yZUltcG9ydHNGcm9tID0gY29tcGlsYXRpb24uaXNDb3JlID8gZ2V0UjNTeW1ib2xzRmlsZSh0aGlzLnRzUHJvZ3JhbSkgOiBudWxsO1xuICAgIGxldCBpbXBvcnRSZXdyaXRlcjogSW1wb3J0UmV3cml0ZXI7XG4gICAgaWYgKGNvcmVJbXBvcnRzRnJvbSAhPT0gbnVsbCkge1xuICAgICAgaW1wb3J0UmV3cml0ZXIgPSBuZXcgUjNTeW1ib2xzSW1wb3J0UmV3cml0ZXIoY29yZUltcG9ydHNGcm9tLmZpbGVOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW1wb3J0UmV3cml0ZXIgPSBuZXcgTm9vcEltcG9ydFJld3JpdGVyKCk7XG4gICAgfVxuXG4gICAgY29uc3QgYmVmb3JlID0gW1xuICAgICAgaXZ5VHJhbnNmb3JtRmFjdG9yeShcbiAgICAgICAgICBjb21waWxhdGlvbi50cmFpdENvbXBpbGVyLCBjb21waWxhdGlvbi5yZWZsZWN0b3IsIGltcG9ydFJld3JpdGVyLFxuICAgICAgICAgIGNvbXBpbGF0aW9uLmRlZmF1bHRJbXBvcnRUcmFja2VyLCBjb21waWxhdGlvbi5pc0NvcmUsIHRoaXMuY2xvc3VyZUNvbXBpbGVyRW5hYmxlZCksXG4gICAgICBhbGlhc1RyYW5zZm9ybUZhY3RvcnkoY29tcGlsYXRpb24udHJhaXRDb21waWxlci5leHBvcnRTdGF0ZW1lbnRzKSxcbiAgICAgIGNvbXBpbGF0aW9uLmRlZmF1bHRJbXBvcnRUcmFja2VyLmltcG9ydFByZXNlcnZpbmdUcmFuc2Zvcm1lcigpLFxuICAgIF07XG5cbiAgICBjb25zdCBhZnRlckRlY2xhcmF0aW9uczogdHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlNvdXJjZUZpbGU+W10gPSBbXTtcbiAgICBpZiAoY29tcGlsYXRpb24uZHRzVHJhbnNmb3JtcyAhPT0gbnVsbCkge1xuICAgICAgYWZ0ZXJEZWNsYXJhdGlvbnMucHVzaChcbiAgICAgICAgICBkZWNsYXJhdGlvblRyYW5zZm9ybUZhY3RvcnkoY29tcGlsYXRpb24uZHRzVHJhbnNmb3JtcywgaW1wb3J0UmV3cml0ZXIpKTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGFkZCBhbGlhc2luZyByZS1leHBvcnRzIHRvIHRoZSAuZC50cyBvdXRwdXQgaWYgdGhlIGBBbGlhc2luZ0hvc3RgIHJlcXVlc3RzIGl0LlxuICAgIGlmIChjb21waWxhdGlvbi5hbGlhc2luZ0hvc3QgIT09IG51bGwgJiYgY29tcGlsYXRpb24uYWxpYXNpbmdIb3N0LmFsaWFzRXhwb3J0c0luRHRzKSB7XG4gICAgICBhZnRlckRlY2xhcmF0aW9ucy5wdXNoKGFsaWFzVHJhbnNmb3JtRmFjdG9yeShjb21waWxhdGlvbi50cmFpdENvbXBpbGVyLmV4cG9ydFN0YXRlbWVudHMpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hZGFwdGVyLmZhY3RvcnlUcmFja2VyICE9PSBudWxsKSB7XG4gICAgICBiZWZvcmUucHVzaChcbiAgICAgICAgICBnZW5lcmF0ZWRGYWN0b3J5VHJhbnNmb3JtKHRoaXMuYWRhcHRlci5mYWN0b3J5VHJhY2tlci5zb3VyY2VJbmZvLCBpbXBvcnRSZXdyaXRlcikpO1xuICAgIH1cbiAgICBiZWZvcmUucHVzaChpdnlTd2l0Y2hUcmFuc2Zvcm0pO1xuXG4gICAgcmV0dXJuIHt0cmFuc2Zvcm1lcnM6IHtiZWZvcmUsIGFmdGVyRGVjbGFyYXRpb25zfSBhcyB0cy5DdXN0b21UcmFuc2Zvcm1lcnN9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJ1biB0aGUgaW5kZXhpbmcgcHJvY2VzcyBhbmQgcmV0dXJuIGEgYE1hcGAgb2YgYWxsIGluZGV4ZWQgY29tcG9uZW50cy5cbiAgICpcbiAgICogU2VlIHRoZSBgaW5kZXhpbmdgIHBhY2thZ2UgZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIGdldEluZGV4ZWRDb21wb25lbnRzKCk6IE1hcDxEZWNsYXJhdGlvbk5vZGUsIEluZGV4ZWRDb21wb25lbnQ+IHtcbiAgICBjb25zdCBjb21waWxhdGlvbiA9IHRoaXMuZW5zdXJlQW5hbHl6ZWQoKTtcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IEluZGV4aW5nQ29udGV4dCgpO1xuICAgIGNvbXBpbGF0aW9uLnRyYWl0Q29tcGlsZXIuaW5kZXgoY29udGV4dCk7XG4gICAgcmV0dXJuIGdlbmVyYXRlQW5hbHlzaXMoY29udGV4dCk7XG4gIH1cblxuICBwcml2YXRlIGVuc3VyZUFuYWx5emVkKHRoaXM6IE5nQ29tcGlsZXIpOiBMYXp5Q29tcGlsYXRpb25TdGF0ZSB7XG4gICAgaWYgKHRoaXMuY29tcGlsYXRpb24gPT09IG51bGwpIHtcbiAgICAgIHRoaXMuYW5hbHl6ZVN5bmMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tcGlsYXRpb24hO1xuICB9XG5cbiAgcHJpdmF0ZSBhbmFseXplU3luYygpOiB2b2lkIHtcbiAgICBjb25zdCBhbmFseXplU3BhbiA9IHRoaXMucGVyZlJlY29yZGVyLnN0YXJ0KCdhbmFseXplJyk7XG4gICAgdGhpcy5jb21waWxhdGlvbiA9IHRoaXMubWFrZUNvbXBpbGF0aW9uKCk7XG4gICAgZm9yIChjb25zdCBzZiBvZiB0aGlzLnRzUHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpKSB7XG4gICAgICBpZiAoc2YuaXNEZWNsYXJhdGlvbkZpbGUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBhbmFseXplRmlsZVNwYW4gPSB0aGlzLnBlcmZSZWNvcmRlci5zdGFydCgnYW5hbHl6ZUZpbGUnLCBzZik7XG4gICAgICB0aGlzLmNvbXBpbGF0aW9uLnRyYWl0Q29tcGlsZXIuYW5hbHl6ZVN5bmMoc2YpO1xuICAgICAgdGhpcy5zY2FuRm9yTXdwKHNmKTtcbiAgICAgIHRoaXMucGVyZlJlY29yZGVyLnN0b3AoYW5hbHl6ZUZpbGVTcGFuKTtcbiAgICB9XG4gICAgdGhpcy5wZXJmUmVjb3JkZXIuc3RvcChhbmFseXplU3Bhbik7XG5cbiAgICB0aGlzLnJlc29sdmVDb21waWxhdGlvbih0aGlzLmNvbXBpbGF0aW9uLnRyYWl0Q29tcGlsZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlQ29tcGlsYXRpb24odHJhaXRDb21waWxlcjogVHJhaXRDb21waWxlcik6IHZvaWQge1xuICAgIHRyYWl0Q29tcGlsZXIucmVzb2x2ZSgpO1xuXG4gICAgLy8gQXQgdGhpcyBwb2ludCwgYW5hbHlzaXMgaXMgY29tcGxldGUgYW5kIHRoZSBjb21waWxlciBjYW4gbm93IGNhbGN1bGF0ZSB3aGljaCBmaWxlcyBuZWVkIHRvXG4gICAgLy8gYmUgZW1pdHRlZCwgc28gZG8gdGhhdC5cbiAgICB0aGlzLmluY3JlbWVudGFsRHJpdmVyLnJlY29yZFN1Y2Nlc3NmdWxBbmFseXNpcyh0cmFpdENvbXBpbGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGZ1bGxUZW1wbGF0ZVR5cGVDaGVjaygpOiBib29sZWFuIHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIHN0cmljdG5lc3MgbGV2ZWwgb2YgdHlwZSBjaGVja2luZyBiYXNlZCBvbiBjb21waWxlciBvcHRpb25zLiBBc1xuICAgIC8vIGBzdHJpY3RUZW1wbGF0ZXNgIGlzIGEgc3VwZXJzZXQgb2YgYGZ1bGxUZW1wbGF0ZVR5cGVDaGVja2AsIHRoZSBmb3JtZXIgaW1wbGllcyB0aGUgbGF0dGVyLlxuICAgIC8vIEFsc28gc2VlIGB2ZXJpZnlDb21wYXRpYmxlVHlwZUNoZWNrT3B0aW9uc2Agd2hlcmUgaXQgaXMgdmVyaWZpZWQgdGhhdCBgZnVsbFRlbXBsYXRlVHlwZUNoZWNrYFxuICAgIC8vIGlzIG5vdCBkaXNhYmxlZCB3aGVuIGBzdHJpY3RUZW1wbGF0ZXNgIGlzIGVuYWJsZWQuXG4gICAgY29uc3Qgc3RyaWN0VGVtcGxhdGVzID0gISF0aGlzLm9wdGlvbnMuc3RyaWN0VGVtcGxhdGVzO1xuICAgIHJldHVybiBzdHJpY3RUZW1wbGF0ZXMgfHwgISF0aGlzLm9wdGlvbnMuZnVsbFRlbXBsYXRlVHlwZUNoZWNrO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUeXBlQ2hlY2tpbmdDb25maWcoKTogVHlwZUNoZWNraW5nQ29uZmlnIHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIHN0cmljdG5lc3MgbGV2ZWwgb2YgdHlwZSBjaGVja2luZyBiYXNlZCBvbiBjb21waWxlciBvcHRpb25zLiBBc1xuICAgIC8vIGBzdHJpY3RUZW1wbGF0ZXNgIGlzIGEgc3VwZXJzZXQgb2YgYGZ1bGxUZW1wbGF0ZVR5cGVDaGVja2AsIHRoZSBmb3JtZXIgaW1wbGllcyB0aGUgbGF0dGVyLlxuICAgIC8vIEFsc28gc2VlIGB2ZXJpZnlDb21wYXRpYmxlVHlwZUNoZWNrT3B0aW9uc2Agd2hlcmUgaXQgaXMgdmVyaWZpZWQgdGhhdCBgZnVsbFRlbXBsYXRlVHlwZUNoZWNrYFxuICAgIC8vIGlzIG5vdCBkaXNhYmxlZCB3aGVuIGBzdHJpY3RUZW1wbGF0ZXNgIGlzIGVuYWJsZWQuXG4gICAgY29uc3Qgc3RyaWN0VGVtcGxhdGVzID0gISF0aGlzLm9wdGlvbnMuc3RyaWN0VGVtcGxhdGVzO1xuXG4gICAgLy8gRmlyc3Qgc2VsZWN0IGEgdHlwZS1jaGVja2luZyBjb25maWd1cmF0aW9uLCBiYXNlZCBvbiB3aGV0aGVyIGZ1bGwgdGVtcGxhdGUgdHlwZS1jaGVja2luZyBpc1xuICAgIC8vIHJlcXVlc3RlZC5cbiAgICBsZXQgdHlwZUNoZWNraW5nQ29uZmlnOiBUeXBlQ2hlY2tpbmdDb25maWc7XG4gICAgaWYgKHRoaXMuZnVsbFRlbXBsYXRlVHlwZUNoZWNrKSB7XG4gICAgICB0eXBlQ2hlY2tpbmdDb25maWcgPSB7XG4gICAgICAgIGFwcGx5VGVtcGxhdGVDb250ZXh0R3VhcmRzOiBzdHJpY3RUZW1wbGF0ZXMsXG4gICAgICAgIGNoZWNrUXVlcmllczogZmFsc2UsXG4gICAgICAgIGNoZWNrVGVtcGxhdGVCb2RpZXM6IHRydWUsXG4gICAgICAgIGFsd2F5c0NoZWNrU2NoZW1hSW5UZW1wbGF0ZUJvZGllczogdHJ1ZSxcbiAgICAgICAgY2hlY2tUeXBlT2ZJbnB1dEJpbmRpbmdzOiBzdHJpY3RUZW1wbGF0ZXMsXG4gICAgICAgIGhvbm9yQWNjZXNzTW9kaWZpZXJzRm9ySW5wdXRCaW5kaW5nczogZmFsc2UsXG4gICAgICAgIHN0cmljdE51bGxJbnB1dEJpbmRpbmdzOiBzdHJpY3RUZW1wbGF0ZXMsXG4gICAgICAgIGNoZWNrVHlwZU9mQXR0cmlidXRlczogc3RyaWN0VGVtcGxhdGVzLFxuICAgICAgICAvLyBFdmVuIGluIGZ1bGwgdGVtcGxhdGUgdHlwZS1jaGVja2luZyBtb2RlLCBET00gYmluZGluZyBjaGVja3MgYXJlIG5vdCBxdWl0ZSByZWFkeSB5ZXQuXG4gICAgICAgIGNoZWNrVHlwZU9mRG9tQmluZGluZ3M6IGZhbHNlLFxuICAgICAgICBjaGVja1R5cGVPZk91dHB1dEV2ZW50czogc3RyaWN0VGVtcGxhdGVzLFxuICAgICAgICBjaGVja1R5cGVPZkFuaW1hdGlvbkV2ZW50czogc3RyaWN0VGVtcGxhdGVzLFxuICAgICAgICAvLyBDaGVja2luZyBvZiBET00gZXZlbnRzIGN1cnJlbnRseSBoYXMgYW4gYWR2ZXJzZSBlZmZlY3Qgb24gZGV2ZWxvcGVyIGV4cGVyaWVuY2UsXG4gICAgICAgIC8vIGUuZy4gZm9yIGA8aW5wdXQgKGJsdXIpPVwidXBkYXRlKCRldmVudC50YXJnZXQudmFsdWUpXCI+YCBlbmFibGluZyB0aGlzIGNoZWNrIHJlc3VsdHMgaW46XG4gICAgICAgIC8vIC0gZXJyb3IgVFMyNTMxOiBPYmplY3QgaXMgcG9zc2libHkgJ251bGwnLlxuICAgICAgICAvLyAtIGVycm9yIFRTMjMzOTogUHJvcGVydHkgJ3ZhbHVlJyBkb2VzIG5vdCBleGlzdCBvbiB0eXBlICdFdmVudFRhcmdldCcuXG4gICAgICAgIGNoZWNrVHlwZU9mRG9tRXZlbnRzOiBzdHJpY3RUZW1wbGF0ZXMsXG4gICAgICAgIGNoZWNrVHlwZU9mRG9tUmVmZXJlbmNlczogc3RyaWN0VGVtcGxhdGVzLFxuICAgICAgICAvLyBOb24tRE9NIHJlZmVyZW5jZXMgaGF2ZSB0aGUgY29ycmVjdCB0eXBlIGluIFZpZXcgRW5naW5lIHNvIHRoZXJlIGlzIG5vIHN0cmljdG5lc3MgZmxhZy5cbiAgICAgICAgY2hlY2tUeXBlT2ZOb25Eb21SZWZlcmVuY2VzOiB0cnVlLFxuICAgICAgICAvLyBQaXBlcyBhcmUgY2hlY2tlZCBpbiBWaWV3IEVuZ2luZSBzbyB0aGVyZSBpcyBubyBzdHJpY3RuZXNzIGZsYWcuXG4gICAgICAgIGNoZWNrVHlwZU9mUGlwZXM6IHRydWUsXG4gICAgICAgIHN0cmljdFNhZmVOYXZpZ2F0aW9uVHlwZXM6IHN0cmljdFRlbXBsYXRlcyxcbiAgICAgICAgdXNlQ29udGV4dEdlbmVyaWNUeXBlOiBzdHJpY3RUZW1wbGF0ZXMsXG4gICAgICAgIHN0cmljdExpdGVyYWxUeXBlczogdHJ1ZSxcbiAgICAgICAgZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcjogdGhpcy5lbmFibGVUZW1wbGF0ZVR5cGVDaGVja2VyLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZUNoZWNraW5nQ29uZmlnID0ge1xuICAgICAgICBhcHBseVRlbXBsYXRlQ29udGV4dEd1YXJkczogZmFsc2UsXG4gICAgICAgIGNoZWNrUXVlcmllczogZmFsc2UsXG4gICAgICAgIGNoZWNrVGVtcGxhdGVCb2RpZXM6IGZhbHNlLFxuICAgICAgICAvLyBFbmFibGUgZGVlcCBzY2hlbWEgY2hlY2tpbmcgaW4gXCJiYXNpY1wiIHRlbXBsYXRlIHR5cGUtY2hlY2tpbmcgbW9kZSBvbmx5IGlmIENsb3N1cmVcbiAgICAgICAgLy8gY29tcGlsYXRpb24gaXMgcmVxdWVzdGVkLCB3aGljaCBpcyBhIGdvb2QgcHJveHkgZm9yIFwib25seSBpbiBnb29nbGUzXCIuXG4gICAgICAgIGFsd2F5c0NoZWNrU2NoZW1hSW5UZW1wbGF0ZUJvZGllczogdGhpcy5jbG9zdXJlQ29tcGlsZXJFbmFibGVkLFxuICAgICAgICBjaGVja1R5cGVPZklucHV0QmluZGluZ3M6IGZhbHNlLFxuICAgICAgICBzdHJpY3ROdWxsSW5wdXRCaW5kaW5nczogZmFsc2UsXG4gICAgICAgIGhvbm9yQWNjZXNzTW9kaWZpZXJzRm9ySW5wdXRCaW5kaW5nczogZmFsc2UsXG4gICAgICAgIGNoZWNrVHlwZU9mQXR0cmlidXRlczogZmFsc2UsXG4gICAgICAgIGNoZWNrVHlwZU9mRG9tQmluZGluZ3M6IGZhbHNlLFxuICAgICAgICBjaGVja1R5cGVPZk91dHB1dEV2ZW50czogZmFsc2UsXG4gICAgICAgIGNoZWNrVHlwZU9mQW5pbWF0aW9uRXZlbnRzOiBmYWxzZSxcbiAgICAgICAgY2hlY2tUeXBlT2ZEb21FdmVudHM6IGZhbHNlLFxuICAgICAgICBjaGVja1R5cGVPZkRvbVJlZmVyZW5jZXM6IGZhbHNlLFxuICAgICAgICBjaGVja1R5cGVPZk5vbkRvbVJlZmVyZW5jZXM6IGZhbHNlLFxuICAgICAgICBjaGVja1R5cGVPZlBpcGVzOiBmYWxzZSxcbiAgICAgICAgc3RyaWN0U2FmZU5hdmlnYXRpb25UeXBlczogZmFsc2UsXG4gICAgICAgIHVzZUNvbnRleHRHZW5lcmljVHlwZTogZmFsc2UsXG4gICAgICAgIHN0cmljdExpdGVyYWxUeXBlczogZmFsc2UsXG4gICAgICAgIGVuYWJsZVRlbXBsYXRlVHlwZUNoZWNrZXI6IHRoaXMuZW5hYmxlVGVtcGxhdGVUeXBlQ2hlY2tlcixcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgZXhwbGljaXRseSBjb25maWd1cmVkIHN0cmljdG5lc3MgZmxhZ3Mgb24gdG9wIG9mIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAgICAvLyBiYXNlZCBvbiBcImZ1bGxUZW1wbGF0ZVR5cGVDaGVja1wiLlxuICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaWN0SW5wdXRUeXBlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0eXBlQ2hlY2tpbmdDb25maWcuY2hlY2tUeXBlT2ZJbnB1dEJpbmRpbmdzID0gdGhpcy5vcHRpb25zLnN0cmljdElucHV0VHlwZXM7XG4gICAgICB0eXBlQ2hlY2tpbmdDb25maWcuYXBwbHlUZW1wbGF0ZUNvbnRleHRHdWFyZHMgPSB0aGlzLm9wdGlvbnMuc3RyaWN0SW5wdXRUeXBlcztcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpY3RJbnB1dEFjY2Vzc01vZGlmaWVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0eXBlQ2hlY2tpbmdDb25maWcuaG9ub3JBY2Nlc3NNb2RpZmllcnNGb3JJbnB1dEJpbmRpbmdzID1cbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RyaWN0SW5wdXRBY2Nlc3NNb2RpZmllcnM7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaWN0TnVsbElucHV0VHlwZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHlwZUNoZWNraW5nQ29uZmlnLnN0cmljdE51bGxJbnB1dEJpbmRpbmdzID0gdGhpcy5vcHRpb25zLnN0cmljdE51bGxJbnB1dFR5cGVzO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLnN0cmljdE91dHB1dEV2ZW50VHlwZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHlwZUNoZWNraW5nQ29uZmlnLmNoZWNrVHlwZU9mT3V0cHV0RXZlbnRzID0gdGhpcy5vcHRpb25zLnN0cmljdE91dHB1dEV2ZW50VHlwZXM7XG4gICAgICB0eXBlQ2hlY2tpbmdDb25maWcuY2hlY2tUeXBlT2ZBbmltYXRpb25FdmVudHMgPSB0aGlzLm9wdGlvbnMuc3RyaWN0T3V0cHV0RXZlbnRUeXBlcztcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpY3REb21FdmVudFR5cGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHR5cGVDaGVja2luZ0NvbmZpZy5jaGVja1R5cGVPZkRvbUV2ZW50cyA9IHRoaXMub3B0aW9ucy5zdHJpY3REb21FdmVudFR5cGVzO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLnN0cmljdFNhZmVOYXZpZ2F0aW9uVHlwZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHlwZUNoZWNraW5nQ29uZmlnLnN0cmljdFNhZmVOYXZpZ2F0aW9uVHlwZXMgPSB0aGlzLm9wdGlvbnMuc3RyaWN0U2FmZU5hdmlnYXRpb25UeXBlcztcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpY3REb21Mb2NhbFJlZlR5cGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHR5cGVDaGVja2luZ0NvbmZpZy5jaGVja1R5cGVPZkRvbVJlZmVyZW5jZXMgPSB0aGlzLm9wdGlvbnMuc3RyaWN0RG9tTG9jYWxSZWZUeXBlcztcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpY3RBdHRyaWJ1dGVUeXBlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0eXBlQ2hlY2tpbmdDb25maWcuY2hlY2tUeXBlT2ZBdHRyaWJ1dGVzID0gdGhpcy5vcHRpb25zLnN0cmljdEF0dHJpYnV0ZVR5cGVzO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLnN0cmljdENvbnRleHRHZW5lcmljcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0eXBlQ2hlY2tpbmdDb25maWcudXNlQ29udGV4dEdlbmVyaWNUeXBlID0gdGhpcy5vcHRpb25zLnN0cmljdENvbnRleHRHZW5lcmljcztcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpY3RMaXRlcmFsVHlwZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHlwZUNoZWNraW5nQ29uZmlnLnN0cmljdExpdGVyYWxUeXBlcyA9IHRoaXMub3B0aW9ucy5zdHJpY3RMaXRlcmFsVHlwZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGVDaGVja2luZ0NvbmZpZztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VGVtcGxhdGVEaWFnbm9zdGljcygpOiBSZWFkb25seUFycmF5PHRzLkRpYWdub3N0aWM+IHtcbiAgICBjb25zdCBjb21waWxhdGlvbiA9IHRoaXMuZW5zdXJlQW5hbHl6ZWQoKTtcblxuICAgIC8vIEdldCB0aGUgZGlhZ25vc3RpY3MuXG4gICAgY29uc3QgdHlwZUNoZWNrU3BhbiA9IHRoaXMucGVyZlJlY29yZGVyLnN0YXJ0KCd0eXBlQ2hlY2tEaWFnbm9zdGljcycpO1xuICAgIGNvbnN0IGRpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNmIG9mIHRoaXMudHNQcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkpIHtcbiAgICAgIGlmIChzZi5pc0RlY2xhcmF0aW9uRmlsZSB8fCB0aGlzLmFkYXB0ZXIuaXNTaGltKHNmKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZGlhZ25vc3RpY3MucHVzaChcbiAgICAgICAgICAuLi5jb21waWxhdGlvbi50ZW1wbGF0ZVR5cGVDaGVja2VyLmdldERpYWdub3N0aWNzRm9yRmlsZShzZiwgT3B0aW1pemVGb3IuV2hvbGVQcm9ncmFtKSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvZ3JhbSA9IHRoaXMudHlwZUNoZWNraW5nUHJvZ3JhbVN0cmF0ZWd5LmdldFByb2dyYW0oKTtcbiAgICB0aGlzLnBlcmZSZWNvcmRlci5zdG9wKHR5cGVDaGVja1NwYW4pO1xuICAgIHRoaXMuaW5jcmVtZW50YWxTdHJhdGVneS5zZXRJbmNyZW1lbnRhbERyaXZlcih0aGlzLmluY3JlbWVudGFsRHJpdmVyLCBwcm9ncmFtKTtcbiAgICB0aGlzLm5leHRQcm9ncmFtID0gcHJvZ3JhbTtcblxuICAgIHJldHVybiBkaWFnbm9zdGljcztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VGVtcGxhdGVEaWFnbm9zdGljc0ZvckZpbGUoc2Y6IHRzLlNvdXJjZUZpbGUsIG9wdGltaXplRm9yOiBPcHRpbWl6ZUZvcik6XG4gICAgICBSZWFkb25seUFycmF5PHRzLkRpYWdub3N0aWM+IHtcbiAgICBjb25zdCBjb21waWxhdGlvbiA9IHRoaXMuZW5zdXJlQW5hbHl6ZWQoKTtcblxuICAgIC8vIEdldCB0aGUgZGlhZ25vc3RpY3MuXG4gICAgY29uc3QgdHlwZUNoZWNrU3BhbiA9IHRoaXMucGVyZlJlY29yZGVyLnN0YXJ0KCd0eXBlQ2hlY2tEaWFnbm9zdGljcycpO1xuICAgIGNvbnN0IGRpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcbiAgICBpZiAoIXNmLmlzRGVjbGFyYXRpb25GaWxlICYmICF0aGlzLmFkYXB0ZXIuaXNTaGltKHNmKSkge1xuICAgICAgZGlhZ25vc3RpY3MucHVzaCguLi5jb21waWxhdGlvbi50ZW1wbGF0ZVR5cGVDaGVja2VyLmdldERpYWdub3N0aWNzRm9yRmlsZShzZiwgb3B0aW1pemVGb3IpKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9ncmFtID0gdGhpcy50eXBlQ2hlY2tpbmdQcm9ncmFtU3RyYXRlZ3kuZ2V0UHJvZ3JhbSgpO1xuICAgIHRoaXMucGVyZlJlY29yZGVyLnN0b3AodHlwZUNoZWNrU3Bhbik7XG4gICAgdGhpcy5pbmNyZW1lbnRhbFN0cmF0ZWd5LnNldEluY3JlbWVudGFsRHJpdmVyKHRoaXMuaW5jcmVtZW50YWxEcml2ZXIsIHByb2dyYW0pO1xuICAgIHRoaXMubmV4dFByb2dyYW0gPSBwcm9ncmFtO1xuXG4gICAgcmV0dXJuIGRpYWdub3N0aWNzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXROb25UZW1wbGF0ZURpYWdub3N0aWNzKCk6IHRzLkRpYWdub3N0aWNbXSB7XG4gICAgaWYgKHRoaXMubm9uVGVtcGxhdGVEaWFnbm9zdGljcyA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgY29tcGlsYXRpb24gPSB0aGlzLmVuc3VyZUFuYWx5emVkKCk7XG4gICAgICB0aGlzLm5vblRlbXBsYXRlRGlhZ25vc3RpY3MgPSBbLi4uY29tcGlsYXRpb24udHJhaXRDb21waWxlci5kaWFnbm9zdGljc107XG4gICAgICBpZiAodGhpcy5lbnRyeVBvaW50ICE9PSBudWxsICYmIGNvbXBpbGF0aW9uLmV4cG9ydFJlZmVyZW5jZUdyYXBoICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMubm9uVGVtcGxhdGVEaWFnbm9zdGljcy5wdXNoKC4uLmNoZWNrRm9yUHJpdmF0ZUV4cG9ydHMoXG4gICAgICAgICAgICB0aGlzLmVudHJ5UG9pbnQsIHRoaXMudHNQcm9ncmFtLmdldFR5cGVDaGVja2VyKCksIGNvbXBpbGF0aW9uLmV4cG9ydFJlZmVyZW5jZUdyYXBoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5vblRlbXBsYXRlRGlhZ25vc3RpY3M7XG4gIH1cblxuICBwcml2YXRlIHNjYW5Gb3JNd3Aoc2Y6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBpbGF0aW9uIS5td3BTY2FubmVyLnNjYW4oc2YsIHtcbiAgICAgIGFkZFR5cGVSZXBsYWNlbWVudDogKG5vZGU6IHRzLkRlY2xhcmF0aW9uLCB0eXBlOiBUeXBlKTogdm9pZCA9PiB7XG4gICAgICAgIC8vIE9ubHkgb2J0YWluIHRoZSByZXR1cm4gdHlwZSB0cmFuc2Zvcm0gZm9yIHRoZSBzb3VyY2UgZmlsZSBvbmNlIHRoZXJlJ3MgYSB0eXBlIHRvIHJlcGxhY2UsXG4gICAgICAgIC8vIHNvIHRoYXQgbm8gdHJhbnNmb3JtIGlzIGFsbG9jYXRlZCB3aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBkby5cbiAgICAgICAgdGhpcy5jb21waWxhdGlvbiEuZHRzVHJhbnNmb3JtcyEuZ2V0UmV0dXJuVHlwZVRyYW5zZm9ybShzZikuYWRkVHlwZVJlcGxhY2VtZW50KG5vZGUsIHR5cGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBtYWtlQ29tcGlsYXRpb24oKTogTGF6eUNvbXBpbGF0aW9uU3RhdGUge1xuICAgIGNvbnN0IGNoZWNrZXIgPSB0aGlzLnRzUHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpO1xuXG4gICAgY29uc3QgcmVmbGVjdG9yID0gbmV3IFR5cGVTY3JpcHRSZWZsZWN0aW9uSG9zdChjaGVja2VyKTtcblxuICAgIC8vIENvbnN0cnVjdCB0aGUgUmVmZXJlbmNlRW1pdHRlci5cbiAgICBsZXQgcmVmRW1pdHRlcjogUmVmZXJlbmNlRW1pdHRlcjtcbiAgICBsZXQgYWxpYXNpbmdIb3N0OiBBbGlhc2luZ0hvc3R8bnVsbCA9IG51bGw7XG4gICAgaWYgKHRoaXMuYWRhcHRlci51bmlmaWVkTW9kdWxlc0hvc3QgPT09IG51bGwgfHwgIXRoaXMub3B0aW9ucy5fdXNlSG9zdEZvckltcG9ydEdlbmVyYXRpb24pIHtcbiAgICAgIGxldCBsb2NhbEltcG9ydFN0cmF0ZWd5OiBSZWZlcmVuY2VFbWl0U3RyYXRlZ3k7XG5cbiAgICAgIC8vIFRoZSBzdHJhdGVneSB1c2VkIGZvciBsb2NhbCwgaW4tcHJvamVjdCBpbXBvcnRzIGRlcGVuZHMgb24gd2hldGhlciBUUyBoYXMgYmVlbiBjb25maWd1cmVkXG4gICAgICAvLyB3aXRoIHJvb3REaXJzLiBJZiBzbywgdGhlbiBtdWx0aXBsZSBkaXJlY3RvcmllcyBtYXkgYmUgbWFwcGVkIGluIHRoZSBzYW1lIFwibW9kdWxlXG4gICAgICAvLyBuYW1lc3BhY2VcIiBhbmQgdGhlIGxvZ2ljIG9mIGBMb2dpY2FsUHJvamVjdFN0cmF0ZWd5YCBpcyByZXF1aXJlZCB0byBnZW5lcmF0ZSBjb3JyZWN0XG4gICAgICAvLyBpbXBvcnRzIHdoaWNoIG1heSBjcm9zcyB0aGVzZSBtdWx0aXBsZSBkaXJlY3Rvcmllcy4gT3RoZXJ3aXNlLCBwbGFpbiByZWxhdGl2ZSBpbXBvcnRzIGFyZVxuICAgICAgLy8gc3VmZmljaWVudC5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucm9vdERpciAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgKHRoaXMub3B0aW9ucy5yb290RGlycyAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucy5yb290RGlycy5sZW5ndGggPiAwKSkge1xuICAgICAgICAvLyByb290RGlycyBsb2dpYyBpcyBpbiBlZmZlY3QgLSB1c2UgdGhlIGBMb2dpY2FsUHJvamVjdFN0cmF0ZWd5YCBmb3IgaW4tcHJvamVjdCByZWxhdGl2ZVxuICAgICAgICAvLyBpbXBvcnRzLlxuICAgICAgICBsb2NhbEltcG9ydFN0cmF0ZWd5ID0gbmV3IExvZ2ljYWxQcm9qZWN0U3RyYXRlZ3koXG4gICAgICAgICAgICByZWZsZWN0b3IsIG5ldyBMb2dpY2FsRmlsZVN5c3RlbShbLi4udGhpcy5hZGFwdGVyLnJvb3REaXJzXSwgdGhpcy5hZGFwdGVyKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQbGFpbiByZWxhdGl2ZSBpbXBvcnRzIGFyZSBhbGwgdGhhdCdzIG5lZWRlZC5cbiAgICAgICAgbG9jYWxJbXBvcnRTdHJhdGVneSA9IG5ldyBSZWxhdGl2ZVBhdGhTdHJhdGVneShyZWZsZWN0b3IpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgQ29tcGlsZXJIb3N0IGRvZXNuJ3QgaGF2ZSBmaWxlTmFtZVRvTW9kdWxlTmFtZSwgc28gYnVpbGQgYW4gTlBNLWNlbnRyaWMgcmVmZXJlbmNlXG4gICAgICAvLyByZXNvbHV0aW9uIHN0cmF0ZWd5LlxuICAgICAgcmVmRW1pdHRlciA9IG5ldyBSZWZlcmVuY2VFbWl0dGVyKFtcbiAgICAgICAgLy8gRmlyc3QsIHRyeSB0byB1c2UgbG9jYWwgaWRlbnRpZmllcnMgaWYgYXZhaWxhYmxlLlxuICAgICAgICBuZXcgTG9jYWxJZGVudGlmaWVyU3RyYXRlZ3koKSxcbiAgICAgICAgLy8gTmV4dCwgYXR0ZW1wdCB0byB1c2UgYW4gYWJzb2x1dGUgaW1wb3J0LlxuICAgICAgICBuZXcgQWJzb2x1dGVNb2R1bGVTdHJhdGVneSh0aGlzLnRzUHJvZ3JhbSwgY2hlY2tlciwgdGhpcy5tb2R1bGVSZXNvbHZlciwgcmVmbGVjdG9yKSxcbiAgICAgICAgLy8gRmluYWxseSwgY2hlY2sgaWYgdGhlIHJlZmVyZW5jZSBpcyBiZWluZyB3cml0dGVuIGludG8gYSBmaWxlIHdpdGhpbiB0aGUgcHJvamVjdCdzIC50c1xuICAgICAgICAvLyBzb3VyY2VzLCBhbmQgdXNlIGEgcmVsYXRpdmUgaW1wb3J0IGlmIHNvLiBJZiB0aGlzIGZhaWxzLCBSZWZlcmVuY2VFbWl0dGVyIHdpbGwgdGhyb3dcbiAgICAgICAgLy8gYW4gZXJyb3IuXG4gICAgICAgIGxvY2FsSW1wb3J0U3RyYXRlZ3ksXG4gICAgICBdKTtcblxuICAgICAgLy8gSWYgYW4gZW50cnlwb2ludCBpcyBwcmVzZW50LCB0aGVuIGFsbCB1c2VyIGltcG9ydHMgc2hvdWxkIGJlIGRpcmVjdGVkIHRocm91Z2ggdGhlXG4gICAgICAvLyBlbnRyeXBvaW50IGFuZCBwcml2YXRlIGV4cG9ydHMgYXJlIG5vdCBuZWVkZWQuIFRoZSBjb21waWxlciB3aWxsIHZhbGlkYXRlIHRoYXQgYWxsIHB1YmxpY2x5XG4gICAgICAvLyB2aXNpYmxlIGRpcmVjdGl2ZXMvcGlwZXMgYXJlIGltcG9ydGFibGUgdmlhIHRoaXMgZW50cnlwb2ludC5cbiAgICAgIGlmICh0aGlzLmVudHJ5UG9pbnQgPT09IG51bGwgJiYgdGhpcy5vcHRpb25zLmdlbmVyYXRlRGVlcFJlZXhwb3J0cyA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBObyBlbnRyeXBvaW50IGlzIHByZXNlbnQgYW5kIGRlZXAgcmUtZXhwb3J0cyB3ZXJlIHJlcXVlc3RlZCwgc28gY29uZmlndXJlIHRoZSBhbGlhc2luZ1xuICAgICAgICAvLyBzeXN0ZW0gdG8gZ2VuZXJhdGUgdGhlbS5cbiAgICAgICAgYWxpYXNpbmdIb3N0ID0gbmV3IFByaXZhdGVFeHBvcnRBbGlhc2luZ0hvc3QocmVmbGVjdG9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIENvbXBpbGVySG9zdCBzdXBwb3J0cyBmaWxlTmFtZVRvTW9kdWxlTmFtZSwgc28gdXNlIHRoYXQgdG8gZW1pdCBpbXBvcnRzLlxuICAgICAgcmVmRW1pdHRlciA9IG5ldyBSZWZlcmVuY2VFbWl0dGVyKFtcbiAgICAgICAgLy8gRmlyc3QsIHRyeSB0byB1c2UgbG9jYWwgaWRlbnRpZmllcnMgaWYgYXZhaWxhYmxlLlxuICAgICAgICBuZXcgTG9jYWxJZGVudGlmaWVyU3RyYXRlZ3koKSxcbiAgICAgICAgLy8gVGhlbiB1c2UgYWxpYXNlZCByZWZlcmVuY2VzICh0aGlzIGlzIGEgd29ya2Fyb3VuZCB0byBTdHJpY3REZXBzIGNoZWNrcykuXG4gICAgICAgIG5ldyBBbGlhc1N0cmF0ZWd5KCksXG4gICAgICAgIC8vIFRoZW4gdXNlIGZpbGVOYW1lVG9Nb2R1bGVOYW1lIHRvIGVtaXQgaW1wb3J0cy5cbiAgICAgICAgbmV3IFVuaWZpZWRNb2R1bGVzU3RyYXRlZ3kocmVmbGVjdG9yLCB0aGlzLmFkYXB0ZXIudW5pZmllZE1vZHVsZXNIb3N0KSxcbiAgICAgIF0pO1xuICAgICAgYWxpYXNpbmdIb3N0ID0gbmV3IFVuaWZpZWRNb2R1bGVzQWxpYXNpbmdIb3N0KHRoaXMuYWRhcHRlci51bmlmaWVkTW9kdWxlc0hvc3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGV2YWx1YXRvciA9IG5ldyBQYXJ0aWFsRXZhbHVhdG9yKHJlZmxlY3RvciwgY2hlY2tlciwgdGhpcy5pbmNyZW1lbnRhbERyaXZlci5kZXBHcmFwaCk7XG4gICAgY29uc3QgZHRzUmVhZGVyID0gbmV3IER0c01ldGFkYXRhUmVhZGVyKGNoZWNrZXIsIHJlZmxlY3Rvcik7XG4gICAgY29uc3QgbG9jYWxNZXRhUmVnaXN0cnkgPSBuZXcgTG9jYWxNZXRhZGF0YVJlZ2lzdHJ5KCk7XG4gICAgY29uc3QgbG9jYWxNZXRhUmVhZGVyOiBNZXRhZGF0YVJlYWRlciA9IGxvY2FsTWV0YVJlZ2lzdHJ5O1xuICAgIGNvbnN0IGRlcFNjb3BlUmVhZGVyID0gbmV3IE1ldGFkYXRhRHRzTW9kdWxlU2NvcGVSZXNvbHZlcihkdHNSZWFkZXIsIGFsaWFzaW5nSG9zdCk7XG4gICAgY29uc3Qgc2NvcGVSZWdpc3RyeSA9XG4gICAgICAgIG5ldyBMb2NhbE1vZHVsZVNjb3BlUmVnaXN0cnkobG9jYWxNZXRhUmVhZGVyLCBkZXBTY29wZVJlYWRlciwgcmVmRW1pdHRlciwgYWxpYXNpbmdIb3N0KTtcbiAgICBjb25zdCBzY29wZVJlYWRlcjogQ29tcG9uZW50U2NvcGVSZWFkZXIgPSBzY29wZVJlZ2lzdHJ5O1xuICAgIGNvbnN0IHNlbWFudGljRGVwR3JhcGhVcGRhdGVyID0gdGhpcy5pbmNyZW1lbnRhbERyaXZlci5nZXRTZW1hbnRpY0RlcEdyYXBoVXBkYXRlcigpO1xuICAgIGNvbnN0IG1ldGFSZWdpc3RyeSA9IG5ldyBDb21wb3VuZE1ldGFkYXRhUmVnaXN0cnkoW2xvY2FsTWV0YVJlZ2lzdHJ5LCBzY29wZVJlZ2lzdHJ5XSk7XG4gICAgY29uc3QgaW5qZWN0YWJsZVJlZ2lzdHJ5ID0gbmV3IEluamVjdGFibGVDbGFzc1JlZ2lzdHJ5KHJlZmxlY3Rvcik7XG5cbiAgICBjb25zdCBtZXRhUmVhZGVyID0gbmV3IENvbXBvdW5kTWV0YWRhdGFSZWFkZXIoW2xvY2FsTWV0YVJlYWRlciwgZHRzUmVhZGVyXSk7XG4gICAgY29uc3QgdHlwZUNoZWNrU2NvcGVSZWdpc3RyeSA9IG5ldyBUeXBlQ2hlY2tTY29wZVJlZ2lzdHJ5KHNjb3BlUmVhZGVyLCBtZXRhUmVhZGVyKTtcblxuXG4gICAgLy8gSWYgYSBmbGF0IG1vZHVsZSBlbnRyeXBvaW50IHdhcyBzcGVjaWZpZWQsIHRoZW4gdHJhY2sgcmVmZXJlbmNlcyB2aWEgYSBgUmVmZXJlbmNlR3JhcGhgIGluXG4gICAgLy8gb3JkZXIgdG8gcHJvZHVjZSBwcm9wZXIgZGlhZ25vc3RpY3MgZm9yIGluY29ycmVjdGx5IGV4cG9ydGVkIGRpcmVjdGl2ZXMvcGlwZXMvZXRjLiBJZiB0aGVyZVxuICAgIC8vIGlzIG5vIGZsYXQgbW9kdWxlIGVudHJ5cG9pbnQgdGhlbiBkb24ndCBwYXkgdGhlIGNvc3Qgb2YgdHJhY2tpbmcgcmVmZXJlbmNlcy5cbiAgICBsZXQgcmVmZXJlbmNlc1JlZ2lzdHJ5OiBSZWZlcmVuY2VzUmVnaXN0cnk7XG4gICAgbGV0IGV4cG9ydFJlZmVyZW5jZUdyYXBoOiBSZWZlcmVuY2VHcmFwaHxudWxsID0gbnVsbDtcbiAgICBpZiAodGhpcy5lbnRyeVBvaW50ICE9PSBudWxsKSB7XG4gICAgICBleHBvcnRSZWZlcmVuY2VHcmFwaCA9IG5ldyBSZWZlcmVuY2VHcmFwaCgpO1xuICAgICAgcmVmZXJlbmNlc1JlZ2lzdHJ5ID0gbmV3IFJlZmVyZW5jZUdyYXBoQWRhcHRlcihleHBvcnRSZWZlcmVuY2VHcmFwaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZmVyZW5jZXNSZWdpc3RyeSA9IG5ldyBOb29wUmVmZXJlbmNlc1JlZ2lzdHJ5KCk7XG4gICAgfVxuXG4gICAgY29uc3Qgcm91dGVBbmFseXplciA9IG5ldyBOZ01vZHVsZVJvdXRlQW5hbHl6ZXIodGhpcy5tb2R1bGVSZXNvbHZlciwgZXZhbHVhdG9yKTtcblxuICAgIGNvbnN0IGR0c1RyYW5zZm9ybXMgPSBuZXcgRHRzVHJhbnNmb3JtUmVnaXN0cnkoKTtcblxuICAgIGNvbnN0IG13cFNjYW5uZXIgPSBuZXcgTW9kdWxlV2l0aFByb3ZpZGVyc1NjYW5uZXIocmVmbGVjdG9yLCBldmFsdWF0b3IsIHJlZkVtaXR0ZXIpO1xuXG4gICAgY29uc3QgaXNDb3JlID0gaXNBbmd1bGFyQ29yZVBhY2thZ2UodGhpcy50c1Byb2dyYW0pO1xuXG4gICAgY29uc3QgZGVmYXVsdEltcG9ydFRyYWNrZXIgPSBuZXcgRGVmYXVsdEltcG9ydFRyYWNrZXIoKTtcbiAgICBjb25zdCByZXNvdXJjZVJlZ2lzdHJ5ID0gbmV3IFJlc291cmNlUmVnaXN0cnkoKTtcblxuICAgIGNvbnN0IGNvbXBpbGF0aW9uTW9kZSA9XG4gICAgICAgIHRoaXMub3B0aW9ucy5jb21waWxhdGlvbk1vZGUgPT09ICdwYXJ0aWFsJyA/IENvbXBpbGF0aW9uTW9kZS5QQVJUSUFMIDogQ29tcGlsYXRpb25Nb2RlLkZVTEw7XG5cbiAgICAvLyBDeWNsZXMgYXJlIGhhbmRsZWQgaW4gZnVsbCBjb21waWxhdGlvbiBtb2RlIGJ5IFwicmVtb3RlIHNjb3BpbmdcIi5cbiAgICAvLyBcIlJlbW90ZSBzY29waW5nXCIgZG9lcyBub3Qgd29yayB3ZWxsIHdpdGggdHJlZSBzaGFraW5nIGZvciBsaWJyYXJpZXMuXG4gICAgLy8gU28gaW4gcGFydGlhbCBjb21waWxhdGlvbiBtb2RlLCB3aGVuIGJ1aWxkaW5nIGEgbGlicmFyeSwgYSBjeWNsZSB3aWxsIGNhdXNlIGFuIGVycm9yLlxuICAgIGNvbnN0IGN5Y2xlSGFuZGxpbmdTdHJhdGVneSA9IGNvbXBpbGF0aW9uTW9kZSA9PT0gQ29tcGlsYXRpb25Nb2RlLkZVTEwgP1xuICAgICAgICBDeWNsZUhhbmRsaW5nU3RyYXRlZ3kuVXNlUmVtb3RlU2NvcGluZyA6XG4gICAgICAgIEN5Y2xlSGFuZGxpbmdTdHJhdGVneS5FcnJvcjtcblxuICAgIC8vIFNldCB1cCB0aGUgSXZ5Q29tcGlsYXRpb24sIHdoaWNoIG1hbmFnZXMgc3RhdGUgZm9yIHRoZSBJdnkgdHJhbnNmb3JtZXIuXG4gICAgY29uc3QgaGFuZGxlcnM6IERlY29yYXRvckhhbmRsZXI8dW5rbm93biwgdW5rbm93biwgU2VtYW50aWNTeW1ib2x8bnVsbCwgdW5rbm93bj5bXSA9IFtcbiAgICAgIG5ldyBDb21wb25lbnREZWNvcmF0b3JIYW5kbGVyKFxuICAgICAgICAgIHJlZmxlY3RvciwgZXZhbHVhdG9yLCBtZXRhUmVnaXN0cnksIG1ldGFSZWFkZXIsIHNjb3BlUmVhZGVyLCBzY29wZVJlZ2lzdHJ5LFxuICAgICAgICAgIHR5cGVDaGVja1Njb3BlUmVnaXN0cnksIHJlc291cmNlUmVnaXN0cnksIGlzQ29yZSwgdGhpcy5yZXNvdXJjZU1hbmFnZXIsXG4gICAgICAgICAgdGhpcy5hZGFwdGVyLnJvb3REaXJzLCB0aGlzLm9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlcyB8fCBmYWxzZSxcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuaTE4blVzZUV4dGVybmFsSWRzICE9PSBmYWxzZSxcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZW5hYmxlSTE4bkxlZ2FjeU1lc3NhZ2VJZEZvcm1hdCAhPT0gZmFsc2UsIHRoaXMudXNlUG9pc29uZWREYXRhLFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5pMThuTm9ybWFsaXplTGluZUVuZGluZ3NJbklDVXMsIHRoaXMubW9kdWxlUmVzb2x2ZXIsIHRoaXMuY3ljbGVBbmFseXplcixcbiAgICAgICAgICBjeWNsZUhhbmRsaW5nU3RyYXRlZ3ksIHJlZkVtaXR0ZXIsIGRlZmF1bHRJbXBvcnRUcmFja2VyLCB0aGlzLmluY3JlbWVudGFsRHJpdmVyLmRlcEdyYXBoLFxuICAgICAgICAgIGluamVjdGFibGVSZWdpc3RyeSwgc2VtYW50aWNEZXBHcmFwaFVwZGF0ZXIsIHRoaXMuY2xvc3VyZUNvbXBpbGVyRW5hYmxlZCksXG5cbiAgICAgIC8vIFRPRE8oYWx4aHViKTogdW5kZXJzdGFuZCB3aHkgdGhlIGNhc3QgaGVyZSBpcyBuZWNlc3NhcnkgKHNvbWV0aGluZyB0byBkbyB3aXRoIGBudWxsYFxuICAgICAgLy8gbm90IGJlaW5nIGFzc2lnbmFibGUgdG8gYHVua25vd25gIHdoZW4gd3JhcHBlZCBpbiBgUmVhZG9ubHlgKS5cbiAgICAgIC8vIGNsYW5nLWZvcm1hdCBvZmZcbiAgICAgICAgbmV3IERpcmVjdGl2ZURlY29yYXRvckhhbmRsZXIoXG4gICAgICAgICAgICByZWZsZWN0b3IsIGV2YWx1YXRvciwgbWV0YVJlZ2lzdHJ5LCBzY29wZVJlZ2lzdHJ5LCBtZXRhUmVhZGVyLFxuICAgICAgICAgICAgZGVmYXVsdEltcG9ydFRyYWNrZXIsIGluamVjdGFibGVSZWdpc3RyeSwgaXNDb3JlLCBzZW1hbnRpY0RlcEdyYXBoVXBkYXRlcixcbiAgICAgICAgICB0aGlzLmNsb3N1cmVDb21waWxlckVuYWJsZWQsIGNvbXBpbGVVbmRlY29yYXRlZENsYXNzZXNXaXRoQW5ndWxhckZlYXR1cmVzLFxuICAgICAgICApIGFzIFJlYWRvbmx5PERlY29yYXRvckhhbmRsZXI8dW5rbm93biwgdW5rbm93biwgU2VtYW50aWNTeW1ib2wgfCBudWxsLHVua25vd24+PixcbiAgICAgIC8vIGNsYW5nLWZvcm1hdCBvblxuICAgICAgLy8gUGlwZSBoYW5kbGVyIG11c3QgYmUgYmVmb3JlIGluamVjdGFibGUgaGFuZGxlciBpbiBsaXN0IHNvIHBpcGUgZmFjdG9yaWVzIGFyZSBwcmludGVkXG4gICAgICAvLyBiZWZvcmUgaW5qZWN0YWJsZSBmYWN0b3JpZXMgKHNvIGluamVjdGFibGUgZmFjdG9yaWVzIGNhbiBkZWxlZ2F0ZSB0byB0aGVtKVxuICAgICAgbmV3IFBpcGVEZWNvcmF0b3JIYW5kbGVyKFxuICAgICAgICAgIHJlZmxlY3RvciwgZXZhbHVhdG9yLCBtZXRhUmVnaXN0cnksIHNjb3BlUmVnaXN0cnksIGRlZmF1bHRJbXBvcnRUcmFja2VyLFxuICAgICAgICAgIGluamVjdGFibGVSZWdpc3RyeSwgaXNDb3JlKSxcbiAgICAgIG5ldyBJbmplY3RhYmxlRGVjb3JhdG9ySGFuZGxlcihcbiAgICAgICAgICByZWZsZWN0b3IsIGRlZmF1bHRJbXBvcnRUcmFja2VyLCBpc0NvcmUsIHRoaXMub3B0aW9ucy5zdHJpY3RJbmplY3Rpb25QYXJhbWV0ZXJzIHx8IGZhbHNlLFxuICAgICAgICAgIGluamVjdGFibGVSZWdpc3RyeSksXG4gICAgICBuZXcgTmdNb2R1bGVEZWNvcmF0b3JIYW5kbGVyKFxuICAgICAgICAgIHJlZmxlY3RvciwgZXZhbHVhdG9yLCBtZXRhUmVhZGVyLCBtZXRhUmVnaXN0cnksIHNjb3BlUmVnaXN0cnksIHJlZmVyZW5jZXNSZWdpc3RyeSwgaXNDb3JlLFxuICAgICAgICAgIHJvdXRlQW5hbHl6ZXIsIHJlZkVtaXR0ZXIsIHRoaXMuYWRhcHRlci5mYWN0b3J5VHJhY2tlciwgZGVmYXVsdEltcG9ydFRyYWNrZXIsXG4gICAgICAgICAgdGhpcy5jbG9zdXJlQ29tcGlsZXJFbmFibGVkLCBpbmplY3RhYmxlUmVnaXN0cnksIHRoaXMub3B0aW9ucy5pMThuSW5Mb2NhbGUpLFxuICAgIF07XG5cbiAgICBjb25zdCB0cmFpdENvbXBpbGVyID0gbmV3IFRyYWl0Q29tcGlsZXIoXG4gICAgICAgIGhhbmRsZXJzLCByZWZsZWN0b3IsIHRoaXMucGVyZlJlY29yZGVyLCB0aGlzLmluY3JlbWVudGFsRHJpdmVyLFxuICAgICAgICB0aGlzLm9wdGlvbnMuY29tcGlsZU5vbkV4cG9ydGVkQ2xhc3NlcyAhPT0gZmFsc2UsIGNvbXBpbGF0aW9uTW9kZSwgZHRzVHJhbnNmb3JtcyxcbiAgICAgICAgc2VtYW50aWNEZXBHcmFwaFVwZGF0ZXIpO1xuXG4gICAgY29uc3QgdGVtcGxhdGVUeXBlQ2hlY2tlciA9IG5ldyBUZW1wbGF0ZVR5cGVDaGVja2VySW1wbChcbiAgICAgICAgdGhpcy50c1Byb2dyYW0sIHRoaXMudHlwZUNoZWNraW5nUHJvZ3JhbVN0cmF0ZWd5LCB0cmFpdENvbXBpbGVyLFxuICAgICAgICB0aGlzLmdldFR5cGVDaGVja2luZ0NvbmZpZygpLCByZWZFbWl0dGVyLCByZWZsZWN0b3IsIHRoaXMuYWRhcHRlciwgdGhpcy5pbmNyZW1lbnRhbERyaXZlcixcbiAgICAgICAgc2NvcGVSZWdpc3RyeSwgdHlwZUNoZWNrU2NvcGVSZWdpc3RyeSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNDb3JlLFxuICAgICAgdHJhaXRDb21waWxlcixcbiAgICAgIHJlZmxlY3RvcixcbiAgICAgIHNjb3BlUmVnaXN0cnksXG4gICAgICBkdHNUcmFuc2Zvcm1zLFxuICAgICAgZXhwb3J0UmVmZXJlbmNlR3JhcGgsXG4gICAgICByb3V0ZUFuYWx5emVyLFxuICAgICAgbXdwU2Nhbm5lcixcbiAgICAgIG1ldGFSZWFkZXIsXG4gICAgICB0eXBlQ2hlY2tTY29wZVJlZ2lzdHJ5LFxuICAgICAgZGVmYXVsdEltcG9ydFRyYWNrZXIsXG4gICAgICBhbGlhc2luZ0hvc3QsXG4gICAgICByZWZFbWl0dGVyLFxuICAgICAgdGVtcGxhdGVUeXBlQ2hlY2tlcixcbiAgICAgIHJlc291cmNlUmVnaXN0cnksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB0aGUgZ2l2ZW4gYFByb2dyYW1gIGlzIEBhbmd1bGFyL2NvcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FuZ3VsYXJDb3JlUGFja2FnZShwcm9ncmFtOiB0cy5Qcm9ncmFtKTogYm9vbGVhbiB7XG4gIC8vIExvb2sgZm9yIGl0c19qdXN0X2FuZ3VsYXIudHMgc29tZXdoZXJlIGluIHRoZSBwcm9ncmFtLlxuICBjb25zdCByM1N5bWJvbHMgPSBnZXRSM1N5bWJvbHNGaWxlKHByb2dyYW0pO1xuICBpZiAocjNTeW1ib2xzID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gTG9vayBmb3IgdGhlIGNvbnN0YW50IElUU19KVVNUX0FOR1VMQVIgaW4gdGhhdCBmaWxlLlxuICByZXR1cm4gcjNTeW1ib2xzLnN0YXRlbWVudHMuc29tZShzdG10ID0+IHtcbiAgICAvLyBUaGUgc3RhdGVtZW50IG11c3QgYmUgYSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBzdGF0ZW1lbnQuXG4gICAgaWYgKCF0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KHN0bXQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEl0IG11c3QgYmUgZXhwb3J0ZWQuXG4gICAgaWYgKHN0bXQubW9kaWZpZXJzID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgIXN0bXQubW9kaWZpZXJzLnNvbWUobW9kID0+IG1vZC5raW5kID09PSB0cy5TeW50YXhLaW5kLkV4cG9ydEtleXdvcmQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEl0IG11c3QgZGVjbGFyZSBJVFNfSlVTVF9BTkdVTEFSLlxuICAgIHJldHVybiBzdG10LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMuc29tZShkZWNsID0+IHtcbiAgICAgIC8vIFRoZSBkZWNsYXJhdGlvbiBtdXN0IG1hdGNoIHRoZSBuYW1lLlxuICAgICAgaWYgKCF0cy5pc0lkZW50aWZpZXIoZGVjbC5uYW1lKSB8fCBkZWNsLm5hbWUudGV4dCAhPT0gJ0lUU19KVVNUX0FOR1VMQVInKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEl0IG11c3QgaW5pdGlhbGl6ZSB0aGUgdmFyaWFibGUgdG8gdHJ1ZS5cbiAgICAgIGlmIChkZWNsLmluaXRpYWxpemVyID09PSB1bmRlZmluZWQgfHwgZGVjbC5pbml0aWFsaXplci5raW5kICE9PSB0cy5TeW50YXhLaW5kLlRydWVLZXl3b3JkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIFRoaXMgZGVmaW5pdGlvbiBtYXRjaGVzLlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlICdyM19zeW1ib2xzLnRzJyBmaWxlIGluIHRoZSBnaXZlbiBgUHJvZ3JhbWAsIG9yIHJldHVybiBgbnVsbGAgaWYgaXQgd2Fzbid0IHRoZXJlLlxuICovXG5mdW5jdGlvbiBnZXRSM1N5bWJvbHNGaWxlKHByb2dyYW06IHRzLlByb2dyYW0pOiB0cy5Tb3VyY2VGaWxlfG51bGwge1xuICByZXR1cm4gcHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpLmZpbmQoZmlsZSA9PiBmaWxlLmZpbGVOYW1lLmluZGV4T2YoJ3IzX3N5bWJvbHMudHMnKSA+PSAwKSB8fCBudWxsO1xufVxuXG4vKipcbiAqIFNpbmNlIFwic3RyaWN0VGVtcGxhdGVzXCIgaXMgYSB0cnVlIHN1cGVyc2V0IG9mIHR5cGUgY2hlY2tpbmcgY2FwYWJpbGl0aWVzIGNvbXBhcmVkIHRvXG4gKiBcImZ1bGxUZW1wbGF0ZVR5cGVDaGVja1wiLCBpdCBpcyByZXF1aXJlZCB0aGF0IHRoZSBsYXR0ZXIgaXMgbm90IGV4cGxpY2l0bHkgZGlzYWJsZWQgaWYgdGhlXG4gKiBmb3JtZXIgaXMgZW5hYmxlZC5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ5Q29tcGF0aWJsZVR5cGVDaGVja09wdGlvbnMob3B0aW9uczogTmdDb21waWxlck9wdGlvbnMpOiB0cy5EaWFnbm9zdGljfG51bGwge1xuICBpZiAob3B0aW9ucy5mdWxsVGVtcGxhdGVUeXBlQ2hlY2sgPT09IGZhbHNlICYmIG9wdGlvbnMuc3RyaWN0VGVtcGxhdGVzID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgICBjb2RlOiBuZ0Vycm9yQ29kZShFcnJvckNvZGUuQ09ORklHX1NUUklDVF9URU1QTEFURVNfSU1QTElFU19GVUxMX1RFTVBMQVRFX1RZUEVDSEVDSyksXG4gICAgICBmaWxlOiB1bmRlZmluZWQsXG4gICAgICBzdGFydDogdW5kZWZpbmVkLFxuICAgICAgbGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICBtZXNzYWdlVGV4dDpcbiAgICAgICAgICBgQW5ndWxhciBjb21waWxlciBvcHRpb24gXCJzdHJpY3RUZW1wbGF0ZXNcIiBpcyBlbmFibGVkLCBob3dldmVyIFwiZnVsbFRlbXBsYXRlVHlwZUNoZWNrXCIgaXMgZGlzYWJsZWQuXG5cbkhhdmluZyB0aGUgXCJzdHJpY3RUZW1wbGF0ZXNcIiBmbGFnIGVuYWJsZWQgaW1wbGllcyB0aGF0IFwiZnVsbFRlbXBsYXRlVHlwZUNoZWNrXCIgaXMgYWxzbyBlbmFibGVkLCBzb1xudGhlIGxhdHRlciBjYW4gbm90IGJlIGV4cGxpY2l0bHkgZGlzYWJsZWQuXG5cbk9uZSBvZiB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaXMgcmVxdWlyZWQ6XG4xLiBSZW1vdmUgdGhlIFwiZnVsbFRlbXBsYXRlVHlwZUNoZWNrXCIgb3B0aW9uLlxuMi4gUmVtb3ZlIFwic3RyaWN0VGVtcGxhdGVzXCIgb3Igc2V0IGl0IHRvICdmYWxzZScuXG5cbk1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHRlbXBsYXRlIHR5cGUgY2hlY2tpbmcgY29tcGlsZXIgb3B0aW9ucyBjYW4gYmUgZm91bmQgaW4gdGhlIGRvY3VtZW50YXRpb246XG5odHRwczovL3Y5LmFuZ3VsYXIuaW8vZ3VpZGUvdGVtcGxhdGUtdHlwZWNoZWNrI3RlbXBsYXRlLXR5cGUtY2hlY2tpbmdgLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuY2xhc3MgUmVmZXJlbmNlR3JhcGhBZGFwdGVyIGltcGxlbWVudHMgUmVmZXJlbmNlc1JlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBncmFwaDogUmVmZXJlbmNlR3JhcGgpIHt9XG5cbiAgYWRkKHNvdXJjZTogRGVjbGFyYXRpb25Ob2RlLCAuLi5yZWZlcmVuY2VzOiBSZWZlcmVuY2U8RGVjbGFyYXRpb25Ob2RlPltdKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCB7bm9kZX0gb2YgcmVmZXJlbmNlcykge1xuICAgICAgbGV0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGlmIChzb3VyY2VGaWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc291cmNlRmlsZSA9IHRzLmdldE9yaWdpbmFsTm9kZShub2RlKS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIE9ubHkgcmVjb3JkIGxvY2FsIHJlZmVyZW5jZXMgKG5vdCByZWZlcmVuY2VzIGludG8gLmQudHMgZmlsZXMpLlxuICAgICAgaWYgKHNvdXJjZUZpbGUgPT09IHVuZGVmaW5lZCB8fCAhaXNEdHNQYXRoKHNvdXJjZUZpbGUuZmlsZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuZ3JhcGguYWRkKHNvdXJjZSwgbm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=