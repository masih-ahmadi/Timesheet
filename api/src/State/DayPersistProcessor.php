<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Day;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProcessorInterface<Day, Day>
 */
final class DayPersistProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<Day, Day> $persistProcessor
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $persistProcessor,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Day
    {
        if ($data instanceof Day) {
            $this->applyRange($data);
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }

    private function applyRange(Day $source): void
    {
        $hours = $source->getHours();
        $off = $source->getOff();
        $startKey = $source->getDate()->format('Ymd');
        $finishKey = $source->getFinish()->format('Ymd');

        if ($finishKey < $startKey) {
            $finishKey = $startKey;
        }

        foreach ($source->getYear()->getDays() as $day) {
            $dayKey = $day->getDate()->format('Ymd');
            if ($dayKey < $startKey || $dayKey > $finishKey) {
                continue;
            }

            if (null !== $off) {
                $day->setOff($off);
            } elseif (null !== $hours) {
                $day->setHours($hours);
            } else {
                $day->setHours(null);
                $day->setOff(null);
            }
        }
    }
}
