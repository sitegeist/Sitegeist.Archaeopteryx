<?php

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx;

use GuzzleHttp\Psr7\Uri;
use Neos\Flow\Annotations as Flow;
use Psr\Http\Message\UriInterface;

/**
 * Link value object modeled partially after the html spec for <a> tags.
 *
 * This Link can be used also as node property:
 *
 * ```yaml
 * My.Content:
 *   properties:
 *     link:
 *       type: 'Sitegeist\Archaeopteryx\Link'
 *       ui:
 *         inspector:
 *           editorOptions:
 *             anchor: true
 *             title: true
 *             targetBlank: true
 *             relNofollow: true
 * ```
 *
 * Note that currently the link editor can only handle and write to
 * the property {@see Link::$target} "_blank" | null
 * and to {@see Link::$rel} ["noopener"] | null
 *
 * The Link values can be accessed in Fusion the following:
 *
 * ```fusion
 * href = ${q(node).property("link").href}
 * title = ${q(node).property("link").title}
 * # ...
 * ```
 *
 * In case you need to cast the uri in {@see Link::$href} explicitly to a string
 * you can use: `String.toString(link.href)`
 *
 * @Flow\Proxy(false)
 */
final class Link implements \JsonSerializable
{
    /**
     * A selection of frequently used target attribute values
     */
    public const TARGET_SELF = '_self';
    public const TARGET_BLANK = '_blank';

    /**
     * A selection of frequently used rel attribute values
     */
    public const REL_NOOPENER = 'noopener';
    public const REL_NOFOLLOW = 'nofollow';

    /**
     * @param array<int, string> $rel
     */
    private function __construct(
        public readonly UriInterface $href,
        public readonly ?string $title,
        public readonly ?string $target,
        public readonly array $rel
    ) {
    }

    /**
     * @param array<int, string> $rel
     */
    public static function create(
        UriInterface $href,
        ?string $title,
        ?string $target,
        array $rel
    ): self {
        $relMap = [];
        foreach ($rel as $value) {
            $relMap[trim(strtolower($value))] = true;
        }
        $trimmedTarget = $target !== null ? trim($target) : '';
        return new self(
            $href,
            $title,
            $trimmedTarget !== '' ? strtolower($trimmedTarget) : null,
            array_keys($relMap)
        );
    }

    /**
     * @param array<string, mixed> $array
     */
    public static function fromArray(array $array): self
    {
        return self::create(
            new Uri($array['href']),
            $array['title'] ?? null,
            $array['target'] ?? null,
            $array['rel'] ?? [],
        );
    }

    public static function fromString(string $string): self
    {
        return self::create(
            new Uri($string),
            null,
            null,
            [],
        );
    }

    public function withTitle(?string $title): self
    {
        return self::create(
            $this->href,
            $title,
            $this->target,
            $this->rel
        );
    }

    public function withTarget(?string $target): self
    {
        return self::create(
            $this->href,
            $this->title,
            $target,
            $this->rel
        );
    }

    /**
     * @param array<int, string> $rel
     */
    public function withRel(array $rel): self
    {
        return self::create(
            $this->href,
            $this->title,
            $this->target,
            $rel
        );
    }

    public function jsonSerialize(): mixed
    {
        return [
            'href' => $this->href->__toString(),
            'title' => $this->title,
            'target' => $this->target,
            'rel' => $this->rel,
        ];
    }
}
