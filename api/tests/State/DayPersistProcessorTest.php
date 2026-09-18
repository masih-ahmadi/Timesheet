<?php

declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Put;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Day;
use App\Entity\Year;
use App\Enum\Off;
use App\Enum\Region;
use App\State\DayPersistProcessor;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
final class DayPersistProcessorTest extends TestCase
{
    public function testAppliesHoursAcrossDateRange(): void
    {
        $year = new Year(2025);
        $year->setRegion(Region::BE);

        $start = new Day($year, new \DateTimeImmutable('2025-01-06'));
        $middle = new Day($year, new \DateTimeImmutable('2025-01-07'));
        $end = new Day($year, new \DateTimeImmutable('2025-01-08'));
        $outside = new Day($year, new \DateTimeImmutable('2025-01-09'));

        $year->addDay($start);
        $year->addDay($middle);
        $year->addDay($end);
        $year->addDay($outside);

        $start->setHours(8);
        $start->finish = new \DateTimeImmutable('2025-01-08');

        $inner = new class implements ProcessorInterface {
            public function process(mixed $data, $operation, array $uriVariables = [], array $context = []): mixed
            {
                return $data;
            }
        };

        $processor = new DayPersistProcessor($inner);
        $processor->process($start, new Put());

        self::assertSame(8, $start->getHours());
        self::assertSame(8, $middle->getHours());
        self::assertSame(8, $end->getHours());
        self::assertNull($outside->getHours());
    }

    public function testOffClearsHours(): void
    {
        $year = new Year(2025);
        $year->setRegion(Region::BE);
        $day = new Day($year, new \DateTimeImmutable('2025-01-06'));
        $year->addDay($day);
        $day->setHours(8);
        $day->setOff(Off::VACATION);

        $inner = new class implements ProcessorInterface {
            public function process(mixed $data, $operation, array $uriVariables = [], array $context = []): mixed
            {
                return $data;
            }
        };

        $processor = new DayPersistProcessor($inner);
        $processor->process($day, new Put());

        self::assertSame(Off::VACATION, $day->getOff());
        self::assertNull($day->getHours());
    }
}
