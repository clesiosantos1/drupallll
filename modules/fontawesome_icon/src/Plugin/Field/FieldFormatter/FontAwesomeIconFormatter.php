<?php

namespace Drupal\fontawesome_icon\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the 'fontawesome_icon' formatter.
 *
 * @FieldFormatter(
 *   id = "fontawesome_icon_formatter",
 *   label = @Translation("Font Awesome Icon"),
 *   field_types = {
 *     "fontawesome_icon"
 *   }
 * )
 */
class FontAwesomeIconFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    foreach ($items as $delta => $item) {
      $icon = isset($item->getValue('values')['value']) ? $item->getValue('values')['value'] : '';
      $elements[$delta] = [
        '#theme' => 'fontawesome_icon_formatter',
        '#icon' => $icon,
      ];
    }

    return $elements;
  }

}
