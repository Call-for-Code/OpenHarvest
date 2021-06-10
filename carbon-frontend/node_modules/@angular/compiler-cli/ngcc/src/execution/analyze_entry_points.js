(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/execution/analyze_entry_points", ["require", "exports", "tslib", "@angular/compiler-cli/ngcc/src/execution/tasks/queues/parallel_task_queue", "@angular/compiler-cli/ngcc/src/execution/tasks/queues/serial_task_queue", "@angular/compiler-cli/ngcc/src/execution/tasks/utils", "@angular/compiler-cli/ngcc/src/packages/build_marker", "@angular/compiler-cli/ngcc/src/packages/entry_point", "@angular/compiler-cli/ngcc/src/writing/cleaning/package_cleaner", "@angular/compiler-cli/ngcc/src/execution/tasks/api"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAnalyzeEntryPointsFn = void 0;
    var tslib_1 = require("tslib");
    var parallel_task_queue_1 = require("@angular/compiler-cli/ngcc/src/execution/tasks/queues/parallel_task_queue");
    var serial_task_queue_1 = require("@angular/compiler-cli/ngcc/src/execution/tasks/queues/serial_task_queue");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/execution/tasks/utils");
    var build_marker_1 = require("@angular/compiler-cli/ngcc/src/packages/build_marker");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    var package_cleaner_1 = require("@angular/compiler-cli/ngcc/src/writing/cleaning/package_cleaner");
    var api_1 = require("@angular/compiler-cli/ngcc/src/execution/tasks/api");
    /**
     * Create the function for performing the analysis of the entry-points.
     */
    function getAnalyzeEntryPointsFn(logger, finder, fileSystem, supportedPropertiesToConsider, typingsOnly, compileAllFormats, propertiesToConsider, inParallel) {
        return function () {
            var e_1, _a, e_2, _b;
            logger.debug('Analyzing entry-points...');
            var startTime = Date.now();
            var entryPointInfo = finder.findEntryPoints();
            var cleaned = package_cleaner_1.cleanOutdatedPackages(fileSystem, entryPointInfo.entryPoints);
            if (cleaned) {
                // If we had to clean up one or more packages then we must read in the entry-points again.
                entryPointInfo = finder.findEntryPoints();
            }
            var entryPoints = entryPointInfo.entryPoints, invalidEntryPoints = entryPointInfo.invalidEntryPoints, graph = entryPointInfo.graph;
            logInvalidEntryPoints(logger, invalidEntryPoints);
            var unprocessableEntryPointPaths = [];
            // The tasks are partially ordered by virtue of the entry-points being partially ordered too.
            var tasks = [];
            try {
                for (var entryPoints_1 = tslib_1.__values(entryPoints), entryPoints_1_1 = entryPoints_1.next(); !entryPoints_1_1.done; entryPoints_1_1 = entryPoints_1.next()) {
                    var entryPoint = entryPoints_1_1.value;
                    var packageJson = entryPoint.packageJson;
                    var hasProcessedTypings = build_marker_1.hasBeenProcessed(packageJson, 'typings');
                    var _c = getPropertiesToProcess(packageJson, supportedPropertiesToConsider, compileAllFormats, typingsOnly), propertiesToProcess = _c.propertiesToProcess, equivalentPropertiesMap = _c.equivalentPropertiesMap;
                    var processDts = hasProcessedTypings ? api_1.DtsProcessing.No :
                        typingsOnly ? api_1.DtsProcessing.Only : api_1.DtsProcessing.Yes;
                    if (propertiesToProcess.length === 0) {
                        // This entry-point is unprocessable (i.e. there is no format property that is of interest
                        // and can be processed). This will result in an error, but continue looping over
                        // entry-points in order to collect all unprocessable ones and display a more informative
                        // error.
                        unprocessableEntryPointPaths.push(entryPoint.path);
                        continue;
                    }
                    try {
                        for (var propertiesToProcess_1 = (e_2 = void 0, tslib_1.__values(propertiesToProcess)), propertiesToProcess_1_1 = propertiesToProcess_1.next(); !propertiesToProcess_1_1.done; propertiesToProcess_1_1 = propertiesToProcess_1.next()) {
                            var formatProperty = propertiesToProcess_1_1.value;
                            if (build_marker_1.hasBeenProcessed(entryPoint.packageJson, formatProperty)) {
                                // The format-path which the property maps to is already processed - nothing to do.
                                logger.debug("Skipping " + entryPoint.name + " : " + formatProperty + " (already compiled).");
                                continue;
                            }
                            var formatPropertiesToMarkAsProcessed = equivalentPropertiesMap.get(formatProperty);
                            tasks.push({ entryPoint: entryPoint, formatProperty: formatProperty, formatPropertiesToMarkAsProcessed: formatPropertiesToMarkAsProcessed, processDts: processDts });
                            // Only process typings for the first property (if not already processed).
                            processDts = api_1.DtsProcessing.No;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (propertiesToProcess_1_1 && !propertiesToProcess_1_1.done && (_b = propertiesToProcess_1.return)) _b.call(propertiesToProcess_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (entryPoints_1_1 && !entryPoints_1_1.done && (_a = entryPoints_1.return)) _a.call(entryPoints_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // Check for entry-points for which we could not process any format at all.
            if (unprocessableEntryPointPaths.length > 0) {
                throw new Error('Unable to process any formats for the following entry-points (tried ' +
                    (propertiesToConsider.join(', ') + "): ") +
                    unprocessableEntryPointPaths.map(function (path) { return "\n  - " + path; }).join(''));
            }
            var duration = Math.round((Date.now() - startTime) / 100) / 10;
            logger.debug("Analyzed " + entryPoints.length + " entry-points in " + duration + "s. " +
                ("(Total tasks: " + tasks.length + ")"));
            return getTaskQueue(logger, inParallel, tasks, graph);
        };
    }
    exports.getAnalyzeEntryPointsFn = getAnalyzeEntryPointsFn;
    function logInvalidEntryPoints(logger, invalidEntryPoints) {
        invalidEntryPoints.forEach(function (invalidEntryPoint) {
            logger.debug("Invalid entry-point " + invalidEntryPoint.entryPoint.path + ".", "It is missing required dependencies:\n" +
                invalidEntryPoint.missingDependencies.map(function (dep) { return " - " + dep; }).join('\n'));
        });
    }
    /**
     * This function computes and returns the following:
     * - `propertiesToProcess`: An (ordered) list of properties that exist and need to be processed,
     *   based on the provided `propertiesToConsider`, the properties in `package.json` and their
     *   corresponding format-paths. NOTE: Only one property per format-path needs to be processed.
     * - `equivalentPropertiesMap`: A mapping from each property in `propertiesToProcess` to the list of
     *   other format properties in `package.json` that need to be marked as processed as soon as the
     *   former has been processed.
     */
    function getPropertiesToProcess(packageJson, propertiesToConsider, compileAllFormats, typingsOnly) {
        var e_3, _a, e_4, _b, e_5, _c;
        var formatPathsToConsider = new Set();
        var propertiesToProcess = [];
        try {
            for (var propertiesToConsider_1 = tslib_1.__values(propertiesToConsider), propertiesToConsider_1_1 = propertiesToConsider_1.next(); !propertiesToConsider_1_1.done; propertiesToConsider_1_1 = propertiesToConsider_1.next()) {
                var prop = propertiesToConsider_1_1.value;
                var formatPath = packageJson[prop];
                // Ignore properties that are not defined in `package.json`.
                if (typeof formatPath !== 'string')
                    continue;
                // Ignore properties that map to the same format-path as a preceding property.
                if (formatPathsToConsider.has(formatPath))
                    continue;
                // Process this property, because it is the first one to map to this format-path.
                formatPathsToConsider.add(formatPath);
                propertiesToProcess.push(prop);
                // If we only need one format processed, there is no need to process any more properties.
                if (!compileAllFormats)
                    break;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (propertiesToConsider_1_1 && !propertiesToConsider_1_1.done && (_a = propertiesToConsider_1.return)) _a.call(propertiesToConsider_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var formatPathToProperties = {};
        try {
            for (var SUPPORTED_FORMAT_PROPERTIES_1 = tslib_1.__values(entry_point_1.SUPPORTED_FORMAT_PROPERTIES), SUPPORTED_FORMAT_PROPERTIES_1_1 = SUPPORTED_FORMAT_PROPERTIES_1.next(); !SUPPORTED_FORMAT_PROPERTIES_1_1.done; SUPPORTED_FORMAT_PROPERTIES_1_1 = SUPPORTED_FORMAT_PROPERTIES_1.next()) {
                var prop = SUPPORTED_FORMAT_PROPERTIES_1_1.value;
                var formatPath = packageJson[prop];
                // Ignore properties that are not defined in `package.json`.
                if (typeof formatPath !== 'string')
                    continue;
                // Ignore properties that do not map to a format-path that will be considered.
                if (!formatPathsToConsider.has(formatPath))
                    continue;
                // Add this property to the map.
                var list = formatPathToProperties[formatPath] || (formatPathToProperties[formatPath] = []);
                list.push(prop);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (SUPPORTED_FORMAT_PROPERTIES_1_1 && !SUPPORTED_FORMAT_PROPERTIES_1_1.done && (_b = SUPPORTED_FORMAT_PROPERTIES_1.return)) _b.call(SUPPORTED_FORMAT_PROPERTIES_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var equivalentPropertiesMap = new Map();
        try {
            for (var propertiesToConsider_2 = tslib_1.__values(propertiesToConsider), propertiesToConsider_2_1 = propertiesToConsider_2.next(); !propertiesToConsider_2_1.done; propertiesToConsider_2_1 = propertiesToConsider_2.next()) {
                var prop = propertiesToConsider_2_1.value;
                var formatPath = packageJson[prop];
                // If we are only processing typings then there should be no format properties to mark
                var equivalentProperties = typingsOnly ? [] : formatPathToProperties[formatPath];
                equivalentPropertiesMap.set(prop, equivalentProperties);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (propertiesToConsider_2_1 && !propertiesToConsider_2_1.done && (_c = propertiesToConsider_2.return)) _c.call(propertiesToConsider_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return { propertiesToProcess: propertiesToProcess, equivalentPropertiesMap: equivalentPropertiesMap };
    }
    function getTaskQueue(logger, inParallel, tasks, graph) {
        var dependencies = utils_1.computeTaskDependencies(tasks, graph);
        return inParallel ? new parallel_task_queue_1.ParallelTaskQueue(logger, tasks, dependencies) :
            new serial_task_queue_1.SerialTaskQueue(logger, tasks, dependencies);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZV9lbnRyeV9wb2ludHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvZXhlY3V0aW9uL2FuYWx5emVfZW50cnlfcG9pbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFhQSxpSEFBZ0Y7SUFDaEYsNkdBQTRFO0lBQzVFLDhFQUFpRTtJQUNqRSxxRkFBMEQ7SUFDMUQsbUZBQStIO0lBQy9ILG1HQUEwRTtJQUcxRSwwRUFBNEU7SUFFNUU7O09BRUc7SUFDSCxTQUFnQix1QkFBdUIsQ0FDbkMsTUFBYyxFQUFFLE1BQXdCLEVBQUUsVUFBc0IsRUFDaEUsNkJBQXVELEVBQUUsV0FBb0IsRUFDN0UsaUJBQTBCLEVBQUUsb0JBQThCLEVBQzFELFVBQW1CO1FBQ3JCLE9BQU87O1lBQ0wsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBQzFDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUU3QixJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDOUMsSUFBTSxPQUFPLEdBQUcsdUNBQXFCLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM5RSxJQUFJLE9BQU8sRUFBRTtnQkFDWCwwRkFBMEY7Z0JBQzFGLGNBQWMsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDM0M7WUFFTSxJQUFBLFdBQVcsR0FBK0IsY0FBYyxZQUE3QyxFQUFFLGtCQUFrQixHQUFXLGNBQWMsbUJBQXpCLEVBQUUsS0FBSyxHQUFJLGNBQWMsTUFBbEIsQ0FBbUI7WUFDaEUscUJBQXFCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFFbEQsSUFBTSw0QkFBNEIsR0FBYSxFQUFFLENBQUM7WUFDbEQsNkZBQTZGO1lBQzdG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QUFDLENBQUMsSUFBSSx1Q0FBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDcEQsSUFBSSxtQ0FBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDdkUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEZXBHcmFwaH0gZnJvbSAnZGVwZW5kZW5jeS1ncmFwaCc7XG5cbmltcG9ydCB7RmlsZVN5c3RlbX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvbG9nZ2luZyc7XG5pbXBvcnQge0ludmFsaWRFbnRyeVBvaW50fSBmcm9tICcuLi9kZXBlbmRlbmNpZXMvZGVwZW5kZW5jeV9yZXNvbHZlcic7XG5pbXBvcnQge0VudHJ5UG9pbnRGaW5kZXJ9IGZyb20gJy4uL2VudHJ5X3BvaW50X2ZpbmRlci9pbnRlcmZhY2UnO1xuaW1wb3J0IHtQYXJhbGxlbFRhc2tRdWV1ZX0gZnJvbSAnLi4vZXhlY3V0aW9uL3Rhc2tzL3F1ZXVlcy9wYXJhbGxlbF90YXNrX3F1ZXVlJztcbmltcG9ydCB7U2VyaWFsVGFza1F1ZXVlfSBmcm9tICcuLi9leGVjdXRpb24vdGFza3MvcXVldWVzL3NlcmlhbF90YXNrX3F1ZXVlJztcbmltcG9ydCB7Y29tcHV0ZVRhc2tEZXBlbmRlbmNpZXN9IGZyb20gJy4uL2V4ZWN1dGlvbi90YXNrcy91dGlscyc7XG5pbXBvcnQge2hhc0JlZW5Qcm9jZXNzZWR9IGZyb20gJy4uL3BhY2thZ2VzL2J1aWxkX21hcmtlcic7XG5pbXBvcnQge0VudHJ5UG9pbnQsIEVudHJ5UG9pbnRKc29uUHJvcGVydHksIEVudHJ5UG9pbnRQYWNrYWdlSnNvbiwgU1VQUE9SVEVEX0ZPUk1BVF9QUk9QRVJUSUVTfSBmcm9tICcuLi9wYWNrYWdlcy9lbnRyeV9wb2ludCc7XG5pbXBvcnQge2NsZWFuT3V0ZGF0ZWRQYWNrYWdlc30gZnJvbSAnLi4vd3JpdGluZy9jbGVhbmluZy9wYWNrYWdlX2NsZWFuZXInO1xuXG5pbXBvcnQge0FuYWx5emVFbnRyeVBvaW50c0ZufSBmcm9tICcuL2FwaSc7XG5pbXBvcnQge0R0c1Byb2Nlc3NpbmcsIFBhcnRpYWxseU9yZGVyZWRUYXNrcywgVGFza1F1ZXVlfSBmcm9tICcuL3Rhc2tzL2FwaSc7XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBmdW5jdGlvbiBmb3IgcGVyZm9ybWluZyB0aGUgYW5hbHlzaXMgb2YgdGhlIGVudHJ5LXBvaW50cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFuYWx5emVFbnRyeVBvaW50c0ZuKFxuICAgIGxvZ2dlcjogTG9nZ2VyLCBmaW5kZXI6IEVudHJ5UG9pbnRGaW5kZXIsIGZpbGVTeXN0ZW06IEZpbGVTeXN0ZW0sXG4gICAgc3VwcG9ydGVkUHJvcGVydGllc1RvQ29uc2lkZXI6IEVudHJ5UG9pbnRKc29uUHJvcGVydHlbXSwgdHlwaW5nc09ubHk6IGJvb2xlYW4sXG4gICAgY29tcGlsZUFsbEZvcm1hdHM6IGJvb2xlYW4sIHByb3BlcnRpZXNUb0NvbnNpZGVyOiBzdHJpbmdbXSxcbiAgICBpblBhcmFsbGVsOiBib29sZWFuKTogQW5hbHl6ZUVudHJ5UG9pbnRzRm4ge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGxvZ2dlci5kZWJ1ZygnQW5hbHl6aW5nIGVudHJ5LXBvaW50cy4uLicpO1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG5cbiAgICBsZXQgZW50cnlQb2ludEluZm8gPSBmaW5kZXIuZmluZEVudHJ5UG9pbnRzKCk7XG4gICAgY29uc3QgY2xlYW5lZCA9IGNsZWFuT3V0ZGF0ZWRQYWNrYWdlcyhmaWxlU3lzdGVtLCBlbnRyeVBvaW50SW5mby5lbnRyeVBvaW50cyk7XG4gICAgaWYgKGNsZWFuZWQpIHtcbiAgICAgIC8vIElmIHdlIGhhZCB0byBjbGVhbiB1cCBvbmUgb3IgbW9yZSBwYWNrYWdlcyB0aGVuIHdlIG11c3QgcmVhZCBpbiB0aGUgZW50cnktcG9pbnRzIGFnYWluLlxuICAgICAgZW50cnlQb2ludEluZm8gPSBmaW5kZXIuZmluZEVudHJ5UG9pbnRzKCk7XG4gICAgfVxuXG4gICAgY29uc3Qge2VudHJ5UG9pbnRzLCBpbnZhbGlkRW50cnlQb2ludHMsIGdyYXBofSA9IGVudHJ5UG9pbnRJbmZvO1xuICAgIGxvZ0ludmFsaWRFbnRyeVBvaW50cyhsb2dnZXIsIGludmFsaWRFbnRyeVBvaW50cyk7XG5cbiAgICBjb25zdCB1bnByb2Nlc3NhYmxlRW50cnlQb2ludFBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuICAgIC8vIFRoZSB0YXNrcyBhcmUgcGFydGlhbGx5IG9yZGVyZWQgYnkgdmlydHVlIG9mIHRoZSBlbnRyeS1wb2ludHMgYmVpbmcgcGFydGlhbGx5IG9yZGVyZWQgdG9vLlxuICAgIGNvbnN0IHRhc2tzOiBQYXJ0aWFsbHlPcmRlcmVkVGFza3MgPSBbXSBhcyBhbnk7XG5cbiAgICBmb3IgKGNvbnN0IGVudHJ5UG9pbnQgb2YgZW50cnlQb2ludHMpIHtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gZW50cnlQb2ludC5wYWNrYWdlSnNvbjtcbiAgICAgIGNvbnN0IGhhc1Byb2Nlc3NlZFR5cGluZ3MgPSBoYXNCZWVuUHJvY2Vzc2VkKHBhY2thZ2VKc29uLCAndHlwaW5ncycpO1xuICAgICAgY29uc3Qge3Byb3BlcnRpZXNUb1Byb2Nlc3MsIGVxdWl2YWxlbnRQcm9wZXJ0aWVzTWFwfSA9IGdldFByb3BlcnRpZXNUb1Byb2Nlc3MoXG4gICAgICAgICAgcGFja2FnZUpzb24sIHN1cHBvcnRlZFByb3BlcnRpZXNUb0NvbnNpZGVyLCBjb21waWxlQWxsRm9ybWF0cywgdHlwaW5nc09ubHkpO1xuICAgICAgbGV0IHByb2Nlc3NEdHMgPSBoYXNQcm9jZXNzZWRUeXBpbmdzID8gRHRzUHJvY2Vzc2luZy5ObyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBpbmdzT25seSA/IER0c1Byb2Nlc3NpbmcuT25seSA6IER0c1Byb2Nlc3NpbmcuWWVzO1xuXG4gICAgICBpZiAocHJvcGVydGllc1RvUHJvY2Vzcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gVGhpcyBlbnRyeS1wb2ludCBpcyB1bnByb2Nlc3NhYmxlIChpLmUuIHRoZXJlIGlzIG5vIGZvcm1hdCBwcm9wZXJ0eSB0aGF0IGlzIG9mIGludGVyZXN0XG4gICAgICAgIC8vIGFuZCBjYW4gYmUgcHJvY2Vzc2VkKS4gVGhpcyB3aWxsIHJlc3VsdCBpbiBhbiBlcnJvciwgYnV0IGNvbnRpbnVlIGxvb3Bpbmcgb3ZlclxuICAgICAgICAvLyBlbnRyeS1wb2ludHMgaW4gb3JkZXIgdG8gY29sbGVjdCBhbGwgdW5wcm9jZXNzYWJsZSBvbmVzIGFuZCBkaXNwbGF5IGEgbW9yZSBpbmZvcm1hdGl2ZVxuICAgICAgICAvLyBlcnJvci5cbiAgICAgICAgdW5wcm9jZXNzYWJsZUVudHJ5UG9pbnRQYXRocy5wdXNoKGVudHJ5UG9pbnQucGF0aCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IGZvcm1hdFByb3BlcnR5IG9mIHByb3BlcnRpZXNUb1Byb2Nlc3MpIHtcbiAgICAgICAgaWYgKGhhc0JlZW5Qcm9jZXNzZWQoZW50cnlQb2ludC5wYWNrYWdlSnNvbiwgZm9ybWF0UHJvcGVydHkpKSB7XG4gICAgICAgICAgLy8gVGhlIGZvcm1hdC1wYXRoIHdoaWNoIHRoZSBwcm9wZXJ0eSBtYXBzIHRvIGlzIGFscmVhZHkgcHJvY2Vzc2VkIC0gbm90aGluZyB0byBkby5cbiAgICAgICAgICBsb2dnZXIuZGVidWcoYFNraXBwaW5nICR7ZW50cnlQb2ludC5uYW1lfSA6ICR7Zm9ybWF0UHJvcGVydHl9IChhbHJlYWR5IGNvbXBpbGVkKS5gKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvcm1hdFByb3BlcnRpZXNUb01hcmtBc1Byb2Nlc3NlZCA9IGVxdWl2YWxlbnRQcm9wZXJ0aWVzTWFwLmdldChmb3JtYXRQcm9wZXJ0eSkhO1xuICAgICAgICB0YXNrcy5wdXNoKHtlbnRyeVBvaW50LCBmb3JtYXRQcm9wZXJ0eSwgZm9ybWF0UHJvcGVydGllc1RvTWFya0FzUHJvY2Vzc2VkLCBwcm9jZXNzRHRzfSk7XG5cbiAgICAgICAgLy8gT25seSBwcm9jZXNzIHR5cGluZ3MgZm9yIHRoZSBmaXJzdCBwcm9wZXJ0eSAoaWYgbm90IGFscmVhZHkgcHJvY2Vzc2VkKS5cbiAgICAgICAgcHJvY2Vzc0R0cyA9IER0c1Byb2Nlc3NpbmcuTm87XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGVudHJ5LXBvaW50cyBmb3Igd2hpY2ggd2UgY291bGQgbm90IHByb2Nlc3MgYW55IGZvcm1hdCBhdCBhbGwuXG4gICAgaWYgKHVucHJvY2Vzc2FibGVFbnRyeVBvaW50UGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdVbmFibGUgdG8gcHJvY2VzcyBhbnkgZm9ybWF0cyBmb3IgdGhlIGZvbGxvd2luZyBlbnRyeS1wb2ludHMgKHRyaWVkICcgK1xuICAgICAgICAgIGAke3Byb3BlcnRpZXNUb0NvbnNpZGVyLmpvaW4oJywgJyl9KTogYCArXG4gICAgICAgICAgdW5wcm9jZXNzYWJsZUVudHJ5UG9pbnRQYXRocy5tYXAocGF0aCA9PiBgXFxuICAtICR7cGF0aH1gKS5qb2luKCcnKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZHVyYXRpb24gPSBNYXRoLnJvdW5kKChEYXRlLm5vdygpIC0gc3RhcnRUaW1lKSAvIDEwMCkgLyAxMDtcbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICAgIGBBbmFseXplZCAke2VudHJ5UG9pbnRzLmxlbmd0aH0gZW50cnktcG9pbnRzIGluICR7ZHVyYXRpb259cy4gYCArXG4gICAgICAgIGAoVG90YWwgdGFza3M6ICR7dGFza3MubGVuZ3RofSlgKTtcblxuICAgIHJldHVybiBnZXRUYXNrUXVldWUobG9nZ2VyLCBpblBhcmFsbGVsLCB0YXNrcywgZ3JhcGgpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBsb2dJbnZhbGlkRW50cnlQb2ludHMobG9nZ2VyOiBMb2dnZXIsIGludmFsaWRFbnRyeVBvaW50czogSW52YWxpZEVudHJ5UG9pbnRbXSk6IHZvaWQge1xuICBpbnZhbGlkRW50cnlQb2ludHMuZm9yRWFjaChpbnZhbGlkRW50cnlQb2ludCA9PiB7XG4gICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgICBgSW52YWxpZCBlbnRyeS1wb2ludCAke2ludmFsaWRFbnRyeVBvaW50LmVudHJ5UG9pbnQucGF0aH0uYCxcbiAgICAgICAgYEl0IGlzIG1pc3NpbmcgcmVxdWlyZWQgZGVwZW5kZW5jaWVzOlxcbmAgK1xuICAgICAgICAgICAgaW52YWxpZEVudHJ5UG9pbnQubWlzc2luZ0RlcGVuZGVuY2llcy5tYXAoZGVwID0+IGAgLSAke2RlcH1gKS5qb2luKCdcXG4nKSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gY29tcHV0ZXMgYW5kIHJldHVybnMgdGhlIGZvbGxvd2luZzpcbiAqIC0gYHByb3BlcnRpZXNUb1Byb2Nlc3NgOiBBbiAob3JkZXJlZCkgbGlzdCBvZiBwcm9wZXJ0aWVzIHRoYXQgZXhpc3QgYW5kIG5lZWQgdG8gYmUgcHJvY2Vzc2VkLFxuICogICBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgYHByb3BlcnRpZXNUb0NvbnNpZGVyYCwgdGhlIHByb3BlcnRpZXMgaW4gYHBhY2thZ2UuanNvbmAgYW5kIHRoZWlyXG4gKiAgIGNvcnJlc3BvbmRpbmcgZm9ybWF0LXBhdGhzLiBOT1RFOiBPbmx5IG9uZSBwcm9wZXJ0eSBwZXIgZm9ybWF0LXBhdGggbmVlZHMgdG8gYmUgcHJvY2Vzc2VkLlxuICogLSBgZXF1aXZhbGVudFByb3BlcnRpZXNNYXBgOiBBIG1hcHBpbmcgZnJvbSBlYWNoIHByb3BlcnR5IGluIGBwcm9wZXJ0aWVzVG9Qcm9jZXNzYCB0byB0aGUgbGlzdCBvZlxuICogICBvdGhlciBmb3JtYXQgcHJvcGVydGllcyBpbiBgcGFja2FnZS5qc29uYCB0aGF0IG5lZWQgdG8gYmUgbWFya2VkIGFzIHByb2Nlc3NlZCBhcyBzb29uIGFzIHRoZVxuICogICBmb3JtZXIgaGFzIGJlZW4gcHJvY2Vzc2VkLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0aWVzVG9Qcm9jZXNzKFxuICAgIHBhY2thZ2VKc29uOiBFbnRyeVBvaW50UGFja2FnZUpzb24sIHByb3BlcnRpZXNUb0NvbnNpZGVyOiBFbnRyeVBvaW50SnNvblByb3BlcnR5W10sXG4gICAgY29tcGlsZUFsbEZvcm1hdHM6IGJvb2xlYW4sIHR5cGluZ3NPbmx5OiBib29sZWFuKToge1xuICBwcm9wZXJ0aWVzVG9Qcm9jZXNzOiBFbnRyeVBvaW50SnNvblByb3BlcnR5W107XG4gIGVxdWl2YWxlbnRQcm9wZXJ0aWVzTWFwOiBNYXA8RW50cnlQb2ludEpzb25Qcm9wZXJ0eSwgRW50cnlQb2ludEpzb25Qcm9wZXJ0eVtdPjtcbn0ge1xuICBjb25zdCBmb3JtYXRQYXRoc1RvQ29uc2lkZXIgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICBjb25zdCBwcm9wZXJ0aWVzVG9Qcm9jZXNzOiBFbnRyeVBvaW50SnNvblByb3BlcnR5W10gPSBbXTtcbiAgZm9yIChjb25zdCBwcm9wIG9mIHByb3BlcnRpZXNUb0NvbnNpZGVyKSB7XG4gICAgY29uc3QgZm9ybWF0UGF0aCA9IHBhY2thZ2VKc29uW3Byb3BdO1xuXG4gICAgLy8gSWdub3JlIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IGRlZmluZWQgaW4gYHBhY2thZ2UuanNvbmAuXG4gICAgaWYgKHR5cGVvZiBmb3JtYXRQYXRoICE9PSAnc3RyaW5nJykgY29udGludWU7XG5cbiAgICAvLyBJZ25vcmUgcHJvcGVydGllcyB0aGF0IG1hcCB0byB0aGUgc2FtZSBmb3JtYXQtcGF0aCBhcyBhIHByZWNlZGluZyBwcm9wZXJ0eS5cbiAgICBpZiAoZm9ybWF0UGF0aHNUb0NvbnNpZGVyLmhhcyhmb3JtYXRQYXRoKSkgY29udGludWU7XG5cbiAgICAvLyBQcm9jZXNzIHRoaXMgcHJvcGVydHksIGJlY2F1c2UgaXQgaXMgdGhlIGZpcnN0IG9uZSB0byBtYXAgdG8gdGhpcyBmb3JtYXQtcGF0aC5cbiAgICBmb3JtYXRQYXRoc1RvQ29uc2lkZXIuYWRkKGZvcm1hdFBhdGgpO1xuICAgIHByb3BlcnRpZXNUb1Byb2Nlc3MucHVzaChwcm9wKTtcblxuICAgIC8vIElmIHdlIG9ubHkgbmVlZCBvbmUgZm9ybWF0IHByb2Nlc3NlZCwgdGhlcmUgaXMgbm8gbmVlZCB0byBwcm9jZXNzIGFueSBtb3JlIHByb3BlcnRpZXMuXG4gICAgaWYgKCFjb21waWxlQWxsRm9ybWF0cykgYnJlYWs7XG4gIH1cblxuICBjb25zdCBmb3JtYXRQYXRoVG9Qcm9wZXJ0aWVzOiB7W2Zvcm1hdFBhdGg6IHN0cmluZ106IEVudHJ5UG9pbnRKc29uUHJvcGVydHlbXX0gPSB7fTtcbiAgZm9yIChjb25zdCBwcm9wIG9mIFNVUFBPUlRFRF9GT1JNQVRfUFJPUEVSVElFUykge1xuICAgIGNvbnN0IGZvcm1hdFBhdGggPSBwYWNrYWdlSnNvbltwcm9wXTtcblxuICAgIC8vIElnbm9yZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBkZWZpbmVkIGluIGBwYWNrYWdlLmpzb25gLlxuICAgIGlmICh0eXBlb2YgZm9ybWF0UGF0aCAhPT0gJ3N0cmluZycpIGNvbnRpbnVlO1xuXG4gICAgLy8gSWdub3JlIHByb3BlcnRpZXMgdGhhdCBkbyBub3QgbWFwIHRvIGEgZm9ybWF0LXBhdGggdGhhdCB3aWxsIGJlIGNvbnNpZGVyZWQuXG4gICAgaWYgKCFmb3JtYXRQYXRoc1RvQ29uc2lkZXIuaGFzKGZvcm1hdFBhdGgpKSBjb250aW51ZTtcblxuICAgIC8vIEFkZCB0aGlzIHByb3BlcnR5IHRvIHRoZSBtYXAuXG4gICAgY29uc3QgbGlzdCA9IGZvcm1hdFBhdGhUb1Byb3BlcnRpZXNbZm9ybWF0UGF0aF0gfHwgKGZvcm1hdFBhdGhUb1Byb3BlcnRpZXNbZm9ybWF0UGF0aF0gPSBbXSk7XG4gICAgbGlzdC5wdXNoKHByb3ApO1xuICB9XG5cbiAgY29uc3QgZXF1aXZhbGVudFByb3BlcnRpZXNNYXAgPSBuZXcgTWFwPEVudHJ5UG9pbnRKc29uUHJvcGVydHksIEVudHJ5UG9pbnRKc29uUHJvcGVydHlbXT4oKTtcbiAgZm9yIChjb25zdCBwcm9wIG9mIHByb3BlcnRpZXNUb0NvbnNpZGVyKSB7XG4gICAgY29uc3QgZm9ybWF0UGF0aCA9IHBhY2thZ2VKc29uW3Byb3BdITtcbiAgICAvLyBJZiB3ZSBhcmUgb25seSBwcm9jZXNzaW5nIHR5cGluZ3MgdGhlbiB0aGVyZSBzaG91bGQgYmUgbm8gZm9ybWF0IHByb3BlcnRpZXMgdG8gbWFya1xuICAgIGNvbnN0IGVxdWl2YWxlbnRQcm9wZXJ0aWVzID0gdHlwaW5nc09ubHkgPyBbXSA6IGZvcm1hdFBhdGhUb1Byb3BlcnRpZXNbZm9ybWF0UGF0aF07XG4gICAgZXF1aXZhbGVudFByb3BlcnRpZXNNYXAuc2V0KHByb3AsIGVxdWl2YWxlbnRQcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIHJldHVybiB7cHJvcGVydGllc1RvUHJvY2VzcywgZXF1aXZhbGVudFByb3BlcnRpZXNNYXB9O1xufVxuXG5mdW5jdGlvbiBnZXRUYXNrUXVldWUoXG4gICAgbG9nZ2VyOiBMb2dnZXIsIGluUGFyYWxsZWw6IGJvb2xlYW4sIHRhc2tzOiBQYXJ0aWFsbHlPcmRlcmVkVGFza3MsXG4gICAgZ3JhcGg6IERlcEdyYXBoPEVudHJ5UG9pbnQ+KTogVGFza1F1ZXVlIHtcbiAgY29uc3QgZGVwZW5kZW5jaWVzID0gY29tcHV0ZVRhc2tEZXBlbmRlbmNpZXModGFza3MsIGdyYXBoKTtcbiAgcmV0dXJuIGluUGFyYWxsZWwgPyBuZXcgUGFyYWxsZWxUYXNrUXVldWUobG9nZ2VyLCB0YXNrcywgZGVwZW5kZW5jaWVzKSA6XG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFNlcmlhbFRhc2tRdWV1ZShsb2dnZXIsIHRhc2tzLCBkZXBlbmRlbmNpZXMpO1xufVxuIl19