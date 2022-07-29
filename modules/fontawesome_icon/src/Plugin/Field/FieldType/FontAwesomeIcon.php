<?php

namespace Drupal\fontawesome_icon\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Provides a field type of Font Awesome Icon.
 *
 * @FieldType(
 *   id = "fontawesome_icon",
 *   label = @Translation("Font Awesome Icon"),
 *   category = @Translation("Icons"),
 *   default_formatter = "fontawesome_icon_formatter",
 *   default_widget = "fontawesome_icon_widget",
 * )
 */
class FontAwesomeIcon extends FieldItemBase {

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return [
      // Columns contains the values that the field will store.
      'columns' => [
        // List the values that the field will save.
        // This field will only save a single value, 'value'.
        'value' => [
          'type' => 'text',
          'size' => 'tiny',
          'not null' => FALSE,
        ],
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties = [];
    $properties['value'] = DataDefinition::create('string');

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $value = $this->get('value')->getValue();
    return $value === NULL || $value === '';
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultFieldSettings() {
    return [
      // Declare a single setting, 'size', with a default value of 'large'.
      'size' => 'large',
    ] + parent::defaultFieldSettings();
  }

}
