/**
 * Component wiring {@link https://github.com/neos/neos-ui/pull/3096}
 *
 * {@link https://docs.neos.io/cms/manual/extending-the-user-interface/react-extensibility-api#component-wiring}
 */
export type EditorProps<Options = {}, Value = any> = {
    /**
     * an identifier which can be used for HTML ID generation
     * @example
     *  "__neos__editor__property---{propertyName}"
     */
    id?: string;
    /** name of the node property to edit */
    identifier: string;
    /**
     * label of the node property
     * to be possibly translated via i18n.translate(label)
     *
     * recommended, when {@link RegisteredEditor.hasOwnLabel} = true is used
     *
     *  @example
     * ```jsx
     *  <Label htmlFor={this.props.id}>
     *      <I18n id={this.props.label} />
     *      {this.props.renderHelpIcon()}
     *  </Label>
     * ```
     */
    label: string;
    /** additional editor options of the `editorOptions` */
    options: Options;
    /**
     * currently edited property value of the node
     * is reactive - eg updates on discard and commit
     */
    value?: Value;
    /**
     * @param secondaryInspectorName identifier, used to implement toggling of the inspector when calling this method twice.
     * @param secondaryInspectorComponentFactory factory for the secondary inspector content or undefined|null to close the secondary inspector
     * @example
     *  props.renderSecondaryInspector('IMAGE_CROPPING', () => <MySecondaryInspectorContent />)
     */
    renderSecondaryInspector(
        secondaryInspectorName: string,
        secondaryInspectorComponentFactory: () => JSX.Element | undefined | null
    ): void;
    /**
     * register value change of the node property, which can be applied or discarded
     *
     * @param value the new value.
     * @param hooks an object whose keys are saveHooks to be triggered, the values are hook-specific options: Example: `{'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextImage}`
     */
    commit(value: Value, hooks?: Record<string, unknown>): void;

    // unofficial api
    /** name of the editor `Foo.Bar/EditorName` */
    editor: string;
    /**
     * renders toggleable button
     *
     * see for an examle:
     * {@link EditorProps.label}
     */
    renderHelpIcon(): JSX.Element | "";
    hooks?: Record<string, unknown>;
    editorRegistry: unknown;
    i18nRegistry: unknown;
    /** applies any pending changes (as if you clicked the apply button) */
    onEnterKey(): void;
    helpMessage?: string;
    helpThumbnail?: string;
    /** the value has pending changes (was changed via commit) */
    highlight?: boolean;
    /**
     * styles an orange or red box-shadow
     * around the element the class is applied
     * to indicate pending changes or failure on validation errors
     *
     * @example
     * ```css
     *  box-shadow: 0 0 0 2px /^(red|orange)$/;
     *  border-radius: 2px;
     * ```
     */
    className: string;
};
