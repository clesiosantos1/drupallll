<?php

namespace Drupal\fontawesome_icon\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\Core\Link;

/**
 * A widget Font Awesome Icon.
 *
 * @FieldWidget(
 *   id = "fontawesome_icon_widget",
 *   label = @Translation("Font Awesome Icon"),
 *   field_types = {
 *     "fontawesome_icon"
 *   }
 * )
 */
class FontAwesomeIconWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $value = isset($items[$delta]->value) ? $items[$delta]->value : '';
    $element += [
      '#type' => 'textfield',
      '#default_value' => $value,
      '#size' => 10000,
      '#maxlength' => 100,
    ];
    return ['value' => $element];
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      // Create the custom setting 'size', and
      // assign a default value of 60.
      'size' => 60,
    ] + parent::defaultSettings();
  }

}
